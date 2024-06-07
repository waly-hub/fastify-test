const storage = require('../../storage');
const iotgo = storage.instance.mongodb.iotgo;
const dbModel = iotgo.getCollection('users');
const GetCache = require('../redis/get_cache');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const config = require('../../config');
const cacheInstance = new GetCache({
    redisClient: storage.instance.redis.cache,
    prefix: config.redisCache.PrefixKey.users,
    timeout: config.redisCache.defaultTimeout,
});

async function find(apikey) {
    //从缓存中获取
    const cacheResult = await cacheInstance.get(apikey);
    if (cacheResult) {
        try {
            const obj = JSON.parse(cacheResult);
            return transformCacheData(obj);
        } catch (e) {
            console.error(`failed to parse user cache:${e}`, 'userDao');
            await cacheInstance.delete(apikey);
        }
    }

    //从数据库中查找数据
    const dbResult = await dbModel.findOne({ apikey }).lean();
    if (dbResult) {
        //设置缓存
        await cacheInstance.set(apikey, JSON.stringify(dbResult));
    }
    return dbResult;
}

//对缓存中取出的数据做转换
function transformCacheData(obj) {
    if (obj._id) obj._id = new ObjectId(obj._id);
    if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
    if (obj.bindAt) obj.bindAt = new Date(obj.bindAt);
    if (obj.weixinInfo && obj.weixinInfo.subscribe_time) obj.weixinInfo.subscribe_time = new Date(obj.weixinInfo.subscribe_time);
    if (obj.currentFamilyId) obj.currentFamilyId = new ObjectId(obj.currentFamilyId);
    if (obj.accountInfo && obj.accountInfo.validAt) obj.accountInfo.validAt = new Date(obj.accountInfo.validAt);
    if (obj.accountInfo && obj.accountInfo.expiredAt) obj.accountInfo.expiredAt = new Date(obj.accountInfo.expiredAt);
    if (obj.extra?.freeTrialExpiredAt) obj.extra.freeTrialExpiredAt = new Date(obj.extra.freeTrialExpiredAt);
    return obj;
}

module.exports = {
    find,
};