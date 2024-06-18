const ObjectId = require('mongoose').Types.ObjectId;
const constant = require('../../../utils/constant');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const storage = require('../../../utils/storage_service').get();
const dbModel = storage.mongodb.iotgo.getCollection('oauth_accesstokens');

const GetCache = require('../../../utils/redis_cache/get_cache');
const cacheInstance = new GetCache({
    redisClient: storage.redis.cache,
    prefix: constant.redisCacheKey.atPrefix,
    timeout: config.redisCacheTtl.accessToken,
});

async function find(accessToken) {
    //从缓存中获取
    const cacheResult = await cacheInstance.get(accessToken);
    if (cacheResult) {
        try {
            const obj = JSON.parse(cacheResult);
            return transformCacheData(obj);
        } catch (e) {
            logger.error('failed to parse access token cache', 'atDao');
            await cacheInstance.delete(accessToken);
        }
    }

    //从数据库中查找数据
    const dbResult = await dbModel.findOne({ accessToken }).lean();
    if (dbResult) {
        //设置缓存
        await cacheInstance.set(accessToken, JSON.stringify(dbResult));
    }
    return dbResult;
}

/**
 * 获取客户端下所有的多端登录凭证
 * @param {object} param0 
 * @param {string} param0.uid 用户标识，一般为apikey
 * @param {string} param0.clientId 客户端标识，一般为appid
 * @returns 
 */
async function findMultiEndpointAccessCredentials({ uid, clientId }) {
    const dbResult = await dbModel.find({ uid, clientId }).lean();
    return dbResult;
}

/**
 * 获取客户端下指定的多端登录凭证
 * @param {object} param0 
 * @param {string} param0.uid 用户标识，一般为apikey
 * @param {string} param0.clientId 客户端标识，一般为appid
 * @param {string} param0.endpointId 会话标识，一般由支持多端登录的客户端传递
 * @returns 
 */
async function findMultiEndpointAccessCredential({ uid, clientId, endpointId }) {
    const dbResult = await dbModel.findOne({ uid, clientId, endpointId }).lean();
    return dbResult;
}

async function findByCondition(condition) {
    const dbResult = await dbModel.findOne(condition).lean();
    return dbResult;
}

async function findManyByCondition(condition) {
    const dbResult = await dbModel.find(condition).lean();
    return dbResult;
}

async function update(accessToken, condition, update) {
    const atInfo = await dbModel.findOneAndUpdate(condition, update, { upsert: true, new: true }).lean();
    if (atInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(accessToken, JSON.stringify(atInfo));
    } else {
        logger.warn('failed to update access token to mongodb', 'atDao');
    }
    return atInfo;
}

async function create(accessToken, doc) {
    const atInfo = await dbModel.create(doc);
    if (atInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(accessToken, JSON.stringify(atInfo));
    } else {
        logger.warn('failed to update access token to mongodb', 'atDao');
    }
    return atInfo;
}

/**
 * 写入at，如果不存在则新建，存在则更新
 * @param {object} param0 
 * @param {string} param0.uid 用户apikey
 * @param {string} param0.clientId 客户端标识，一般为appid
 * @param {string} param0.endpointId 登录端标识，由发起登录的客户端传递
 * @param {string} param0.expires 过期时间
 * @param {string} param0.accessToken at
 */
async function upsertAccessToken({ uid, clientId, endpointId, expires, accessToken }) {
    const atInfo = await dbModel.findOneAndUpdate({ uid, clientId, endpointId }, { $set: { expires, accessToken } }, { upsert: true, new: true }).lean();
    if (atInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(accessToken, JSON.stringify(atInfo));
    } else {
        logger.warn('failed to update access token to mongodb', 'atDao');
    }
    return atInfo;
}


async function remove(accessToken) {
    await Promise.all([
        dbModel.deleteOne({ accessToken }),
        cacheInstance.delete(accessToken),
    ]);
}

async function removeByUID(uid) {
    const resultList = await dbModel.find({ uid }).lean();
    for (const item of resultList) {
        await remove(item.accessToken);
    }
}

async function clearCache(accessToken) {
    await cacheInstance.delete(accessToken);
}

//对缓存中取出的数据做转换
function transformCacheData(obj) {
    if (obj._id) obj._id = new ObjectId(obj._id);
    if (obj.expires) obj.expires = new Date(obj.expires);
    return obj;
}

module.exports = {
    create,
    upsertAccessToken,
    find,
    findMultiEndpointAccessCredentials,
    findMultiEndpointAccessCredential,
    findByCondition,
    update,
    remove,
    removeByUID,
    clearCache,
    findManyByCondition,
};


/**
 * @typedef OauthAccessToken
 * @property {ObjectId} _id
 * @property {ObjectId} accessToken - at
 * @property {ObjectId} clientId - appid
 * @property {ObjectId} [endpointId] - 终端id
 * @property {ObjectId} uid - 用户apikey
 * @property {ObjectId} expires - at过期时间
 * @property {ObjectId} [client] - 客户端信息
 * @property {ObjectId} client.platform
 * @property {ObjectId} client.app
 * @property {ObjectId} client.deviceName
 */