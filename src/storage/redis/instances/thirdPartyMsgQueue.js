const config = require('../../../config');
const IORedisClient = require('../ioredis_client');

const redisConfig = config.redis.thirdPartyMsgQueue;

const client = new IORedisClient({
    port: redisConfig.port,
    url: redisConfig.host,
    isCluster: redisConfig.cluster,
    alias: 'thirdPartyMsgQueue',
});
module.exports = client;