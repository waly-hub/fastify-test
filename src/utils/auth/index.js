const crypto = require('crypto');
const response = require('../response');
const { errorCode, headersKey, thingType } = require('../constant');
const config = require('../../config');

const baseSetting = require('../base_setting');

const invokeQuotaService = require('../../service/invoke_quota');
const atDao = require('../../dao/mongo/iotgo/oauth_accesstokens');
const userDao = require('../../dao/mongo/iotgo/users');
const fdDao = require('../../dao/mongo/iotgo/factorydevices');
const deviceDao = require('../../dao/mongo/iotgo/devices');

const iHostWhiteListCache = require('../../dao/redis/ihost_whitelist');

const logger = require('../logger');
const { getRelationWithDevice } = require('../../service/thing/device');
const { UIID } = require('../uiid');

/**
 * 
 * @param {object} param0
 * @param {}
 * @param {import('../setup').LambdaApiRequest} param0.req
 * @returns {Promise<{
 *  error: number,
 *  msg: string,
 *  data: {
 *      clientId: string,
 *      tokenInfo: import('../../dao/mongo/iotgo/oauth_accesstokens').OauthAccessToken,
 *      userInfo: import('../../dao/mongo/iotgo/users').UserInfo
 *  }
 * }>}
 */
async function verify(req) {
    const { authorization } = req.headers;
    if (!authorization || typeof authorization !== 'string') {
        return response.error(errorCode.paramsError, 'invalid authorization: empty');
    }

    let appid = null;
    let result = null;
    if (authorization.startsWith('Bearer ')) {
        //access token验证
        const accessToken = authorization.replace('Bearer ', '');
        result = await getAccessTokenInfo({ accessToken, req });
        if (result.error) {
            return result;
        } else {
            appid = result.data.tokenInfo.clientId;
        }
    } else if (authorization.startsWith('Sign ')) {
        //签名验证
        const sign = authorization.replace('Sign ', '');
        result = await _checkSign({ sign, req });
        if (result.error) {
            return result;
        } else {
            appid = req.headers[headersKey.appid];
        }
    } else {
        return response.error(errorCode.paramsError, 'invalid authorization: must start with Bearer/Sign');
    }

    const checkInvokeRet = await _checkInvoke(appid, req.path);
    if (checkInvokeRet.error) {
        return checkInvokeRet;
    }

    return result;
}

/**
 * 
 * @param {object} param0
 * @param {string} param0.accessToken
 * @param {import('../setup').LambdaApiRequest} param0.req
 * @returns 
 */
async function getAccessTokenInfo({ accessToken, req }) {
    //查找token的信息
    const tokenInfo = await atDao.find(accessToken);
    if (!tokenInfo) {
        return response.error(errorCode.accessTokenError, 'cannot found access token info');
    }

    //将appid和apikey注入到响应上下文的对象中，以备全局使用（比如日志）
    if (req && req.requestCtx) {
        req.requestCtx.appid = tokenInfo.clientId;
        req.requestCtx.apikey = tokenInfo.uid;
    }

    //检查token是否过期
    const expiresDate = new Date(tokenInfo.expires);
    const now = new Date();
    if (now > expiresDate) {
        return response.error(errorCode.accessTokenExpired, 'access token expired');
    }

    //根据token信息中的uid查找用户信息
    const userInfo = await userDao.find(tokenInfo.uid);
    if (!userInfo) {
        return response.error(errorCode.resourceNotFound, 'cannot found user info');
    }

    return response.ok({ tokenInfo, userInfo, clientId: tokenInfo.clientId });
}

async function _checkSign({ sign, req }) {
    //检查headers中的appid字段，签名校验必须
    const appid = req.headers[headersKey.appid];
    if (!appid) {
        return response.error(errorCode.paramsError, `sign verification must have ${headersKey.appid}`);
    }

    //将appid注入到响应上下文的对象中，以备全局使用（比如日志）
    if (req && req.requestCtx) {
        req.requestCtx.appid = appid;
    }

    //取得appid对应的client信息
    const appidConfig = await baseSetting.getAppSettings(appid);
    if (!appidConfig) {
        return response.error(errorCode.paramsError, 'invalid appid');
    }

    //校验签名是否正确
    let paramsStr;
    if (req.method === 'GET' || req.method === 'DELETE') {
        //GET/DELETE请求，从url后带的参数计算签名
        const query = [];
        for (const key in req.query) {
            query.push({ key, value: req.query[key] });
        }
        query.sort(function (a, b) {
            return a.key < b.key ? -1 : 1;
        });
        const queryStrs = [];
        for (const item of query) {
            queryStrs.push(`${item.key}=${item.value}`);
        }
        paramsStr = queryStrs.join('&');
    } else {
        //其它请求，从body带的参数计算签名
        paramsStr = req.rawBody;
    }
    const buffer = Buffer.from(paramsStr, 'utf-8');
    const theSign = crypto.createHmac('sha256', appidConfig.clientSecret).update(buffer).digest('base64');
    if (theSign === sign) {
        return response.ok({ clientId: appid });
    } else {
        logger.warn(`sign verification failed: ${theSign} - ${sign}`);
        return response.error(errorCode.paramsError, 'sign verification failed');
    }
}

async function invokerVerify({ req, invokeKeys }) {
    const { authorization } = req.headers;
    if (!authorization || typeof authorization !== 'string') {
        return response.error(errorCode.paramsError, 'invalid authorization: empty');
    }

    if (authorization.startsWith('Bearer ')) {
        //secret key验证
        const _invokeKey = authorization.replace('Bearer ', '');
        for (const key of invokeKeys) {
            if (_invokeKey === key) {
                return response.ok();
            }
        }
        return response.error(errorCode.paramsError, 'invalid invoke key');
    } else {
        return response.error(errorCode.paramsError, 'invalid authorization: must start with Bearer');
    }
}

async function deviceVerify({ req, ignoreSeqCheck, deviceRequired = true, whiteKeyList = [] }) {
    // 内网接口调用标志
    const intranetReqFlag = req?.requestCtx?.intranetReqFlag;

    //检查参数
    const deviceid = req.headers['x-ck-deviceid'];
    const seq = req.headers['x-ck-seq'];
    const authorization = req.headers['authorization'];

    if (!deviceid || typeof deviceid !== 'string') {
        return response.error(errorCode.paramsError, 'invalid deviceid');
    }

    if (req && req.requestCtx) {
        req.requestCtx.deviceid = deviceid;
    }

    if (!seq || typeof seq !== 'number') {
        return response.error(errorCode.paramsError, 'invalid seq');
    }

    //取得fd表的信息
    const fd = await fdDao.find(deviceid);
    if (!fd) {
        return response.error(errorCode.resourceNotFound, `fdData not found,deviceid:${deviceid}`);
    }

    if (fd?.extra?.uiid === UIID.iHost) {
        ignoreSeqCheck = true;
    }

    if (!ignoreSeqCheck) {  //是否忽略seq的时间戳校验
        //必须在当前时间的前后一分钟内
        if (seq >= Date.now() + config.deviceVerifyWaitTime || seq <= Date.now() - config.deviceVerifyWaitTime) {
            return response.error(errorCode.paramsError, `${deviceid}_${seq}:expired seq`, { linkedError: errorCode.seqExpired });
        }
    } else {
        //如果忽略校验，则检查长度
        const len = seq.toString().length;
        if (len !== 13) {
            return response.error(errorCode.paramsError, 'invalid seq');
        }
    }

    if (!intranetReqFlag && (!authorization || typeof authorization !== 'string')) {
        return response.error(errorCode.paramsError, 'invalid authorization');
    }

    //将fd注入上下文
    if (req && req.requestCtx) {
        req.requestCtx.fd = fd;
    }

    const apikey = fd.apikey;
    if (!intranetReqFlag && whiteKeyList.includes(authorization.replace('Sign ', ''))) {
        const at = req.headers['x-ck-proxy'];
        const tokenInfo = await atDao.find(at);
        if (!tokenInfo) {
            return response.error(errorCode.paramsError, 'sign at failed');
        }
        const uid = tokenInfo.uid;
        const deviceInfo = await deviceDao.find(deviceid);
        if (!deviceInfo || getRelationWithDevice(uid, deviceInfo) === thingType.noRelation) {
            return response.error(errorCode.paramsError, 'device match user failed');
        }
    } else if (!intranetReqFlag) {
        const encryption = crypto.createHash('sha256').update(`${apikey}_${deviceid}_${seq}`).digest('hex');
        const sign = `Sign ${encryption}`;
        if (sign !== authorization) {
            if (fd?.extra?.uiid !== UIID.iHost) {
                return response.error(errorCode.paramsError, 'sign verification failed');
            }
            const allowedApikey = await iHostWhiteListCache.getApikeyByDeviceId(deviceid);
            if (!allowedApikey) {
                return response.error(errorCode.paramsError, 'sign verification failed');
            }

            if (req?.requestCtx && allowedApikey) {
                req.requestCtx.allowedApikey = allowedApikey;
            }
        }
    }

    //取得device表的信息
    const device = await deviceDao.find(deviceid);
    if (!device && deviceRequired) {
        //如果设备数据是必需的，但查无数据，返回错误
        return response.error(errorCode.resourceNotFound, `device not found,deviceid:${deviceid}`);
    }

    //将fd&device注入上下文
    if (req && req.requestCtx) {
        req.requestCtx.device = device;
        req.requestCtx.apikey = device?.apikey;
    }
    return response.ok();
}


/**
 * 校验从oauth2授权页来的请求
 * @param {object} req 
 * @returns 
 */
async function oauthVerify(req) {
    const clientId = req.headers[headersKey.appid];
    //将appid注入到响应上下文的对象中，以备全局使用（比如日志）
    if (req.requestCtx) {
        req.requestCtx.appid = clientId;
    }

    const seq = req.headers[headersKey.seq];

    const authorization = req.headers[headersKey.authorization];

    //取得appid对应的client信息
    const oauthClientConfig = await baseSetting.getAppSettings(clientId);
    if (!oauthClientConfig) {
        return response.error(errorCode.oauth2InvalidAppid, 'invalid appid');
    }

    //校验签名是否正确
    const paramsStr = `${clientId}_${seq}`;
    const buffer = Buffer.from(paramsStr, 'utf-8');
    const theSign = crypto.createHmac('sha256', oauthClientConfig.clientSecret).update(buffer).digest('base64');
    const sign = authorization.replace('Sign ', '');
    if (theSign === sign) {
        return response.ok({ clientId });
    } else {
        logger.warn(`sign verification failed: ${theSign} - ${sign}`);
        return response.error(errorCode.paramsError, 'sign verification failed');
    }
}

/**
 * 是否有权限调用接口的鉴权
 * @param {string} clientId 
 * @param {string} path 
 * @returns 
 */
async function _checkInvoke(clientId, path) {
    //取得appid的配置
    const oauthClientConfig = await baseSetting.getAppSettings(clientId);
    if (!oauthClientConfig) {
        return response.error(errorCode.paramsError, `appid is invalid! ${clientId}`);
    }

    //检查app的enable是否打开,打开的话就不允许访问
    if (oauthClientConfig.enable === '1') {
        return response.error(errorCode.unauthorizedAppID, `appid is unauthorized! ${clientId}`);
    }

    const appidConfig = await baseSetting.getAppConfigs(clientId);
    //检查app的是否过期，过期的话也不允许访问
    if (appidConfig.expiredAt.getTime() < Date.now()) {
        return response.error(errorCode.appidExpired, 'appid has expired');
    }

    //-----appid鉴权----------
    //先检测是否是白名单内的app
    if (!config.appidWhiteList.has(clientId)) {
        //检查是否有权限调用该接口
        const checkPathSuccess = await _checkPath(oauthClientConfig.role, path);
        if (!checkPathSuccess) {
            return response.error(errorCode.unauthorizedAppID, `the path of request is not allowed with appid:${clientId}`);
        }

        //检查是否是oauth2应用，并且进行相应检查
        const checkOAuthSuccess = await _checkOAuth2(oauthClientConfig);
        if (!checkOAuthSuccess) {
            return response.error(errorCode.invokeTooMuch, `invoke too much:${clientId}`);
        }
    }

    return response.ok();
}

/**
 * 检查指定role是否有权限调用指定path的接口
 * @param {string} role 
 * @param {string} path 
 * @returns 
 */
async function _checkPath(role, path) {
    //对不在白名单内的app检测是否具有调用接口的权限
    const roleConfig = await baseSetting.getRoleSettings(role);
    if (!roleConfig) {
        return false;
    }

    const roleResources = roleConfig.resources;
    if (!roleResources) {
        return false;
    }

    for (const item of roleResources) {
        //v2接口
        if (item.indexOf('/v2/') > -1) {
            const regex = new RegExp(`^${item}$`);
            if (regex.test(path)) {
                return true;
            }
        } else if (path.indexOf(item) > -1) {
            //v1接口延续原有写法
            return true;
        }
    }

    //path都没有命中
    return false;
}

/**
 * 检查该请求是否来自oauth2应用并且达到调用次数上限
 * @param {object} oauthClientConfig 
 * @returns {boolean} canInvoke
 */
async function _checkOAuth2(oauthClientConfig) {
    if (oauthClientConfig.role !== config.oauth2RoleId) {
        return true;
    }

    const clientId = oauthClientConfig.clientId;

    //调用次数+1
    let invokeTimes = await invokeQuotaService.invokeTimesINCR(clientId);

    //检查是否到达调用次数限制
    const quotaObj = await invokeQuotaService.getQuotas(oauthClientConfig);

    if (quotaObj.newQuota > quotaObj.oldQuota) {
        //有新的流量包,可能需要重新设置次数
        if (invokeTimes > quotaObj.oldQuota) {
            invokeTimes = quotaObj.oldQuota + 1;
            //之前的调用次数已经超过了原本的配额，所以在新的流量包生效之前，需要将调用次数重置为原本的配额
            await invokeQuotaService.setInvokeTimes(clientId, invokeTimes);
        }
    }

    if (invokeTimes > quotaObj.newQuota) {
        return false;
    }

    return true;
}

module.exports = {
    verify,
    invokerVerify,
    deviceVerify,
    getAccessTokenInfo,
    oauthVerify,
};