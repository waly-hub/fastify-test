const castDao = require('../../dao/mongo/iotgo/casts');
const logger = require('../../utils/logger');
const response = require('../../utils/response');
const crypto = require('crypto');
const atDao = require('../../dao/mongo/iotgo/oauth_accesstokens');
const storage = require('../../utils/storage_service').get();
const config = require('../../config');
const { errorCode, redisCacheKey } = require('../../utils/constant');
const GetCache = require('../../utils/redis_cache/get_cache');
const cacheInstance = new GetCache({
    redisClient: storage.redis.cache,
    prefix: redisCacheKey.atPrefix,
    timeout: config.redisCacheTtl.accessToken,
});
const refreshTokenModel = storage.mongodb.iotgo.getCollection('oauth_refreshtokens');
const { sendCastNotify } = require('../../service/thing/device/http2ws');

async function unbindCast(unbindThings = null, unbindScenes = null) {
    if (unbindThings && unbindThings instanceof Array && unbindThings.length > 0) {
        const deviceids = unbindThings.map(t => t.deviceid);
        const groupIds = unbindThings.map(t => t.groupId);

        // 设备删除后，将该设备关联的所有cast数据清空
        // 并发送长连接指令通知cast
        // cast端将再次调用接口获取最新面板数据
        if (deviceids && deviceids.length > 0) {
            const params = { $or: [{ things: { $in: deviceids } }, { cameras: { $in: deviceids } }] };

            if (unbindThings[0].apikey) params.apikey = unbindThings[0].apikey;

            const casts = await castDao.findMany(params);

            for (const cast of casts) {
                const things = cast.things?.filter(t => !deviceids.includes(t)) ?? [];
                const charts = cast.charts?.filter(c => !deviceids.includes(c)) ?? [];
                const cameras = cast.cameras?.filter(c => !deviceids.includes(c)) ?? [];
                await castDao.updateOne(cast._id, {
                    $set: {
                        things,
                        charts,
                        cameras
                    }
                });

                await sendCastNotify(cast.apikey, {
                    "type": "edit",
                    "id": cast._id,
                    "things": things,
                    "charts": charts,
                    "cameras": cameras
                });
            }
        }

        // 群组删除后，将该群组关联的所有cast数据清空
        // 并发送长连接指令通知cast
        // cast端将再次调用接口获取最新面板数据
        if (groupIds && groupIds.length > 0) {
            const casts = await castDao.findMany({ things: { $in: groupIds } });

            for (const cast of casts) {
                const newThings = cast.things?.filter(t => !groupIds.includes(t)) ?? [];

                await castDao.updateOne(cast._id, {
                    $set: {
                        things: newThings,
                    }
                });

                await sendCastNotify(cast.apikey, {
                    "type": "edit",
                    "id": cast._id,
                    "things": newThings,
                });
            }
        }
    }

    // 场景删除（或者类型转变成不支持的场景）后，将该场景关联的所有cast数据清空
    // 并发送长连接指令通知cast
    // cast端将再次调用接口获取最新面板数据
    if (unbindScenes && unbindScenes instanceof Array && unbindScenes.length > 0) {
        const ids = unbindScenes.map(o => o.id);
        const params = { scenes: { $in: ids } };

        if (unbindScenes[0].apikey) params.apikey = unbindScenes[0].apikey;

        const casts = await castDao.findMany(params);

        for (const cast of casts) {
            const scenes = cast.scenes.filter(s => !ids.includes(s));

            await castDao.updateOne(cast._id, { $set: { scenes: scenes } });

            await sendCastNotify(cast.apikey, {
                "type": "edit",
                "id": cast._id,
                "scenes": scenes
            });
        }
    }
}


/**
* 生成指定app下的指定用户的appid和apikey
* 支持设置 at 和 rt 的过期时间
* @param {String} apikey 
*/
async function generateWebCastToken(apikey) {
    try {
        //生产随机字符串
        const tokenRes = _generateRandomToken();
        if (tokenRes.error) {
            throw tokenRes.error;
        }
        const accessToken = tokenRes.randomToken;
        // 设置过期时间,at默认过期时间为30天
        const expireTimestamp = new Date().setDate(new Date().getDate() + 30);
        const expireDate = new Date(expireTimestamp);
        //更新刷新token
        const refreshTokenRes = _generateRandomToken();
        if (refreshTokenRes.error) {
            throw refreshTokenRes.error;
        }
        const refreshToken = refreshTokenRes.randomToken;
        // 设置过期时间,at默认过期时间为60天
        const rtExpireTimestamp = new Date().setDate(new Date().getDate() + 60);   //当前时间+60天
        const rtExpireDate = new Date(rtExpireTimestamp);
        let clientId;

        //查找原来的access token，查找当前用户的所有在Webcast中的tokens
        const oldTokenInfos = await atDao.findManyByCondition({ uid: apikey, clientId: { $in: config.castAppids } });
        // 如果原来的token数已达到签发上限（5个）
        if (oldTokenInfos?.length === config.castAppids.length) {
            // 找到最早签发的token，通过比较过期时间来确定最早签发的Token
            let newToken = oldTokenInfos[0];
            for (const oldTokenInfo of oldTokenInfos) {
                if (newToken.expires.getTime() > oldTokenInfo.expires.getTime()) {
                    newToken = oldTokenInfo;
                }
            }
            // 获取token的appId
            clientId = newToken.clientId;
            // 把最早签发的token更新为最新签发的token
            await atDao.update(accessToken, { _id: newToken._id }, {
                accessToken,
                expires: expireDate
            });

            //更新成功，删除原有的at缓存
            await cacheInstance.del(newToken.accessToken);
            // 更新rt
            await refreshTokenModel.updateOne({ uid: newToken.uid, clientId }, {
                expires: rtExpireDate,
                refreshToken: refreshToken
            });
        } else {
            // 如果token数还没还没有达到签发上限(5个)
            // 找到5个固定的castAppid中，还没有被使用的castAppid
            clientId = config.castAppids.find(cai => !oldTokenInfos?.find(oti => oti.clientId === cai));
            // 创建accessToken
            await atDao.create(accessToken, {
                accessToken,
                clientId,
                uid: apikey,
                expires: expireDate
            });
            // 创建refreshToken
            await refreshTokenModel.create({
                expires: rtExpireDate,
                clientId,
                uid: apikey,
                refreshToken: refreshToken
            });
        }

        return response.ok({
            at: accessToken,
            atExpiredTime: expireTimestamp,
            rt: refreshToken,
            rtExpiredTime: rtExpireTimestamp,
            clientId
        });
    } catch (err) {
        return response.error(errorCode.internalError, "failed to generate Token");
    }
}

function _generateRandomToken() {
    try {
        const buffer = crypto.randomBytes(256);
        return { randomToken: crypto.createHash('sha1').update(buffer).digest('hex') };
    } catch (error) {
        return response.error(errorCode.internalError, 'failed to generate random token');
    }
}


module.exports = {
    unbindCast,
    generateWebCastToken
};