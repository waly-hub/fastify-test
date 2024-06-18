const crypto = require('crypto');

const config = require('../../config');

const logger = require('../../utils/logger');
const response = require('../../utils/response');
const { errorCode, userErrorCode } = require('../../utils/constant');
const { requestPromise } = require('../../utils/request');

const userGlobalsDao = require('../../dao/mongo/iotgo/user_globals');

const globalUserUrl = `${config.incElb['cn']}/apiv2-inc/user/user-region`;

/**
 *  以前 cn 全球表操作是调用 api-invoke 接口
 *  再将接口返回的错误码转为特殊错误码
 *  现在将 cn 全球表操作转为直接操作数据库，但是错误码需要与特殊错误码一致
 */

/**
 * 用来获取指定账号在全球表内的region值
 * @param {String} account phoneNumber/email
 * @param {String} [uns] 账号体系唯一串
 */
async function findRegionInGlobal(account, uns) {
    const accountStr = uns ? account.toLowerCase() + uns : account.toLowerCase();
    const accountDigest = _getAccountSecret(accountStr);

    // 现网的全球表在 cn
    if (config.region === 'cn') {
        const regionInfo = await userGlobalsDao.getUserRegionByAccountDigest(accountDigest);
        if (!regionInfo) {
            return response.error(userErrorCode.accountNotFound, `user account ${accountStr} does not exist`);
        }
        return response.ok({ region: regionInfo.region });
    }

    // 其它区域则调用内部 elb
    const params = {
        uri: globalUserUrl,
        qs: { accountDigest },
        method: 'GET',
        timeout: 5000
    };

    let resp;
    let requestTime = 0;

    while (++requestTime <= 2) {
        if (requestTime === 2) params.timeout = 8000;
        try {
            const respStr = await requestPromise(params);
            resp = JSON.parse(respStr);
            // 如果返回成功或找不到用户，就停止重试
            if ([errorCode.noError, errorCode.resourceNotFound].includes(resp.error)) break;
        } catch (error) {
            logger.error(`findRegionInGlobal: requestTime: ${requestTime}; account: ${accountStr}; accountDigest: ${accountDigest}; Error: ${error.stack || error}`);
        }
    }

    if (!resp) return response.error(userErrorCode.getUserRequestError, 'Error in getting user region from global!');

    if (resp.error === errorCode.resourceNotFound) return response.error(userErrorCode.accountNotFound, `user account ${accountStr} does not exist`);

    if (resp.error !== errorCode.noError) {
        logger.error(`findRegionInGlobal: account: ${accountStr}; accountDigest: ${accountDigest}; Error: ${resp.msg}`);
        return response.error(userErrorCode.getUserResponseError, `global response error`);
    }

    return response.ok({ region: resp.data.region });
}

/**
 * 将某个用户注册到全球用户表内
 * @param {String} account phoneNumber/email
 * @param {String} [uns] 账号体系唯一串
 */
async function postUserToGlobal(account, uns) {
    const accountStr = uns ? account.toLowerCase() + uns : account.toLowerCase();
    const accountDigest = _getAccountSecret(accountStr);

    // 现网的全球表所在区域是 cn
    if (config.region === 'cn') {
        const exists = await userGlobalsDao.ifUserRegionExists(accountDigest);
        if (exists) {
            logger.error(`postUserToGlobal: user exist! account: ${accountStr}; accountDigest: ${accountDigest}`);
            return response.error(userErrorCode.createUserResponseError, 'data existed');
        }

        //插入数据
        const result = await userGlobalsDao.createUserRegionInfo(accountDigest, config.region);
        if (!result) {
            logger.error(`postUserToGlobal: created failed! account: ${accountStr}; accountDigest: ${accountDigest}`);
            return response.error(userErrorCode.createUserResponseError, 'create failed');
        }

        return response.ok();
    }

    // 其它区域则调用内部 elb
    const params = {
        uri: globalUserUrl,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountDigest, region: config.region }),
        method: 'POST',
        timeout: 5000
    };

    let resp;
    let requestTime = 0;

    while (++requestTime <= 2) {
        if (requestTime === 2) params.timeout = 8000;
        try {
            const respStr = await requestPromise(params);
            resp = JSON.parse(respStr);
            if (resp.error === 0) break;
        } catch (error) {
            logger.error(`postUserToGlobal: requestTime: ${requestTime}; account: ${accountStr}; params: ${JSON.stringify(params.body)}; Error: ${error.stack || error}`);
        }
    }

    if (!resp) return response.error(userErrorCode.createUserRequestError, 'Post user info into global error!');

    if (resp.error !== errorCode.noError) {
        logger.error(`postUserToGlobal: account: ${accountStr}; params: ${JSON.stringify(params.body)}; Error: ${resp.msg}`);
        return response.error(userErrorCode.createUserResponseError, `global response error`);
    }

    return response.ok();
}

/**
 * 将某个用户从全球表内删除
 * @param {String} account phoneNumber/email
 * @param {String} [uns] 账号体系唯一串
 */
async function deleteUserFromGlobal(account, uns) {
    const accountStr = uns ? account.toLowerCase() + uns : account.toLowerCase();
    const accountDigest = _getAccountSecret(accountStr);

    // 现网的全球表所在区域是 cn
    if (config.region === 'cn') {
        const doc = await userGlobalsDao.getUserRegionByAccountDigest(accountDigest);
        if (!doc) {
            logger.error(`deleteUserFromGlobal: user does not exist! account: ${accountStr}; accountDigest: ${accountDigest}`);
            return response.error(userErrorCode.accountNotFound, 'user does not exists');
        }

        // 删除账户区域数据
        const result = await userGlobalsDao.deleteUserRegionByAccountDigest(accountDigest);
        if (result.deletedCount === 0) {
            logger.error(`deleteUserFromGlobal: delete failed! account: ${accountStr}; accountDigest: ${accountDigest}； doc: ${JSON.stringify(doc)}; result: ${JSON.stringify(result)}`);
            return response.error(userErrorCode.deleteUserResponseError, 'delete failed');
        }

        return response.ok();
    }

    // 其它区域则调用内部 elb
    const params = {
        uri: globalUserUrl,
        qs: { accountDigest },
        method: 'DELETE',
        timeout: 5000
    };

    let resp;
    let requestTime = 0;

    while (++requestTime <= 2) {
        if (requestTime === 2) params.timeout = 8000;
        try {
            const respStr = await requestPromise(params);
            resp = JSON.parse(respStr);
            if (resp.error === 0) break;
        } catch (error) {
            logger.error(`deleteUserFromGlobal: requestTime: ${requestTime}; account: ${accountStr}; accountDigest: ${accountDigest}; Error: ${error.stack || error}`);
        }
    }

    if (!resp) return response.error(userErrorCode.deleteUserRequestError, 'delete user info from global error!');

    if (resp.error === errorCode.resourceNotFound) return response.error(userErrorCode.accountNotFound, 'user does not exist!');

    if (resp.error !== errorCode.noError) {
        logger.error(`deleteUserFromGlobal: account: ${accountStr}; accountDigest: ${accountDigest}; Error: ${resp.msg}`);
        return response.error(userErrorCode.deleteUserResponseError, `global response error`);
    }

    return response.ok();
}

function _getAccountSecret(account) {
    return crypto.createHash('md5').update(account).digest('hex');
}

module.exports = {
    findRegionInGlobal,
    postUserToGlobal,
    deleteUserFromGlobal
};