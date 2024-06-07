const iotgo = require('./mongodb/iotgo');
const otaDB = require('./mongodb/otadb');
const redisCache = require('./redis/instances/cache');
const thirdPartyMsgQueue = require('./redis/instances/thirdPartyMsgQueue');

const instance = {
    mongodb: {
        iotgo,
        otaDB,
    },
    redis: {
        cache: redisCache,
        thirdPartyMsgQueue,
    },
};

const initStatus = {
    mongodb: {
        iotgo: { ready: false },
        otaDB: { ready: false },
    },
    redis: {
        cache: { ready: false },
        thirdPartyMsgQueue: { ready: false },

    },
};


async function connect() {
    try {
        await Promise.all([
            iotgo.connect(),
            otaDB.connect(),
            redisCache.connect(),
        ]);
    } catch (err) {
        console.error('failed to connect to storage', err);
        return { error: err };
    }
    return {};
}

//测试重连
/**
 * @function 新版connect，加入了连接数据库的可选项，
 * @param {Object} connectOptions // 可选需要连接的数据库
 * @param {Boolean} [connectOptions.iotgo] // 选项：连接iotgo
 * @param {Boolean} [connectOptions.otaDB] // 选项：连接otaDB
 * @param {Boolean} [connectOptions.redisCache] // 选项：连接redisCache
 */
async function connectV2(connectOptions = { iotgo: true, redisCache: true }) {
    try {
        let connectList = [];

        if (connectOptions.iotgo) {
            connectList.push(iotgo.connect());
        }

        if (connectOptions.otaDB) {
            connectList.push(otaDB.connect());
        }

        if (connectOptions.redisCache) {
            connectList.push(redisCache.connect());
        }

        await Promise.all(connectList);
    } catch (err) {
        console.error('failed to connect to storage', err);
        return { error: err };
    }
    return {};
}

/**
 * @function 在connectV2的基础上，增加了判断连接成功与否的机制，如果之前已经连接成功，则不再连接
 * @param {Object} connectOptions // 可选需要连接的数据库
 * @param {Boolean} [connectOptions.iotgo] // 选项：连接iotgo
 * @param {Boolean} [connectOptions.otaDB] // 选项：连接otaDB
 * @param {Boolean} [connectOptions.redisCache] // 选项：连接redisCache
 * @param {Boolean} [connectOptions.thirdPartyMsgQueue] // 选项：连接thirdPartyMsgQueue
 */
async function connectV3(connectOptions = { iotgo: true, redisCache: true }) {
    console.log('-----------', connectOptions);
    try {
        const connectList = [];
        const statusList = [];

        if (connectOptions.iotgo && !initStatus.mongodb.iotgo.ready) {
            connectList.push(iotgo.connect());
            statusList.push(initStatus.mongodb.iotgo);
        }

        if (connectOptions.otaDB && !initStatus.mongodb.otaDB.ready) {
            connectList.push(otaDB.connect());
            statusList.push(initStatus.mongodb.otaDB);
        }

        if (connectOptions.redisCache && !initStatus.redis.cache.ready) {
            connectList.push(redisCache.connect());
            statusList.push(initStatus.redis.cache);
        }

        if (connectOptions.thirdPartyMsgQueue && !initStatus.redis.thirdPartyMsgQueue.ready) {
            connectList.push(thirdPartyMsgQueue.connect());
            statusList.push(initStatus.redis.thirdPartyMsgQueue);
        }

        const resultList = await Promise.all(connectList);
        let resError = undefined;
        for (let i = 0; i < resultList.length; i++) {
            const result = resultList[i];
            if (result.error) {
                resError = result.error;
            } else {
                statusList[i].ready = true;
            }
        }
        return { error: resError };
    } catch (err) {
        return { error: err };
    }
}

module.exports = {
    connect,
    connectV2,
    connectV3,
    instance,
};
