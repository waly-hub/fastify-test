const config = require('../../../config');
const IORedisClient = require('../ioredis_client');
let cacheRedisHost = process.env.cacheRedisHost;
let isCluster = false;

if (!cacheRedisHost) {
    cacheRedisHost = config.redis.cache.host;
}

if (process.env.cacheRedisIsCluster === undefined) {
    isCluster = config.redis.cache.cluster;
} else if (process.env.cacheRedisIsCluster === 'true') {
    isCluster = true;
}
const client = new IORedisClient({
    port: config.redis.cache.port,
    url: cacheRedisHost,
    isCluster: isCluster,
    alias: 'cache',
});
module.exports = client;