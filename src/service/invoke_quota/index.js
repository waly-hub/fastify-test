//接口调用次数redis

const { redisCacheKey, reCalculateInterval } = require('../../utils/constant');
const stringCache = require('../../utils/redis_cache/get_cache');

const storage = require('../../utils/storage_service').get();
const dataPlanModel = storage.mongodb.iotgo.getCollection('data_plan');
const logger = require('../../utils/logger');

const quotasMap = new Map();

const cacheInstance = new stringCache({
    redisClient: storage.redis.cache,
    prefix: redisCacheKey.apiInvokeTimesPrefix,
});

/**
 * 计算接口调用配额
 * @param {object} oauthClientConfig 
 * @returns {object} obj
 * @returns {Number} obj.newQuota 新配额
 * @returns {Number} obj.oldQuota 旧配额
 * @returns {Number} obj.calculateAt 计算时间
 */
async function _calcualteQuota(oauthClientConfig) {
    const clientId = oauthClientConfig.clientId;
    //基础配额
    let newQuota = oauthClientConfig.basicInvokeQuota;
    let oldQuota = oauthClientConfig.basicInvokeQuota;
    const now = new Date();
    const dataPlans = await dataPlanModel.find({ clientId: clientId, startTime: { $lte: now }, endTime: { $gt: now } }).lean();
    for (const dataPlan of dataPlans) {
        //流量包
        newQuota += dataPlan.quota;
        if (!dataPlan.effectiveAt) {
            //首次激活
            await dataPlanModel.updateOne({ _id: dataPlan._id }, { $set: { effectiveAt: now } });
        } else {
            //已激活过
            oldQuota += dataPlan.quota;
        }
    }

    return { newQuota, oldQuota, calculateAt: now.getTime() };
}

/**
 * 获取指定clientId的每月接口调用配额
 * @param {object} oauthClientConfig 
 * @returns {object} quotaObj
 * @returns {Number} quotaObj.newQuota
 * @returns {Number} quotaObj.oldQuota
 */
async function getQuotas(oauthClientConfig) {
    const clientId = oauthClientConfig.clientId;
    const quotaObjStr = quotasMap.get(clientId);
    if (!quotaObjStr) {
        //重新计算
        const quotaObj = await _calcualteQuota(oauthClientConfig);
        quotasMap.set(clientId, JSON.stringify(quotaObj));
        return {
            newQuota: quotaObj.newQuota,
            oldQuota: quotaObj.oldQuota,
        };
    }

    const quotaObj = JSON.parse(quotaObjStr);

    //检查上次计算时间距离现在是否超过了5分钟
    if (quotaObj.calculateAt + reCalculateInterval <= Date.now()) {
        //重新计算
        const quotaObj = await _calcualteQuota(oauthClientConfig);
        quotasMap.set(clientId, JSON.stringify(quotaObj));
        return {
            newQuota: quotaObj.newQuota,
            oldQuota: quotaObj.oldQuota,
        };
    }

    return {
        newQuota: quotaObj.newQuota,
        oldQuota: quotaObj.oldQuota,
    };
}

/**
 * 指定客户端接口调用次数+1
 * @param {string} clientId 
 * @returns {Number}
 */
async function invokeTimesINCR(clientId) {
    return await cacheInstance.incr(clientId);
}

/**
 * 获取指定客户端接口调用次数
 * @param {string} clientId 
 * @returns {Number}
 */
async function getInvokeTimes(clientId) {
    return await cacheInstance.get(clientId);
}

/**
 * 设置指定客户端接口调用次数
 * @param {string} clientId 
 * @param {Number} value 
 * @returns {Number}
 */
async function setInvokeTimes(clientId, value) {
    await cacheInstance.setWithoutTtl(clientId, value);
}

module.exports = {
    getQuotas,
    invokeTimesINCR,
    setInvokeTimes,
    getInvokeTimes,
};