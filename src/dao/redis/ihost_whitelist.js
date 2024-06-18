const storage = require('../../utils/storage_service').get();
const HashCache = require('../../utils/redis_cache/hash_cache');

const iHostWhiteListCache = new HashCache({
    redisClient: storage.redis.cache,
    prefix: '',
});

const iHostWhiteListCacheKey = 'auth_whitelist';

/**
 * 为兼容部分iHost设备加密算法错误，临时放开部分设备对调用接口的调用机制,刘熠估计大概要存在2个月~1年
 * @param {string} deviceid 
 * @returns 
 */
async function getApikeyByDeviceId(deviceid) {
    return await iHostWhiteListCache.hget(iHostWhiteListCacheKey, deviceid);
}

module.exports = {
    getApikeyByDeviceId,
};

