/* eslint-disable no-console */
const storage = require('../storage');

/**
 * 由于lambda实例会小概率出现连接数据库失败，所以在这里增加重试机制
 * 每个lambda实例会重试maxRetry次，每次间隔不少于retryInterval毫秒
 * 如果达到最大重试次数，则退出lambda实例
 */
const MAX_RETRY = 5;
const RETRY_INTERVAL = 5000;
let retryTs = 0;
let retryCount = 0;

/**
 * 记录数据lambda示例记录到的数据库读写错误次数，如果达到一定次数，则退出实例
 */
const MAX_ERROR = 50;
let errorCount = 0;

/**
 * 
 * @param {object} connectOptions
 * @param {boolean} connectOptions.iotgo - true表示连接
 * @param {boolean} connectOptions.otaDB - true表示连接
 * @param {boolean} connectOptions.redisCache - true表示连接
 * @param {boolean} connectOptions.thirdPartyMsgQueue - true表示连接
 * @returns 
 */
async function connect(connectOptions) {
    if (retryCount >= MAX_RETRY) {
        console.error('storage error: too many retries for connecting storage, exit');
        process.exit(-1);
    }

    if (Date.now() - retryTs < RETRY_INTERVAL) {
        return new Error('storage error: cooldown for re-connecting storage');
    }

    const result = await storage.connectV3(connectOptions);
    if (result.error) {
        // eslint-disable-next-line require-atomic-updates
        retryTs = Date.now();
        retryCount++;
        console.error('storage error: failed to connect storage', result.error);
    }
    return result.error;
}

function get() {
    return storage.instance;
}

function recordError() {
    errorCount++;
    if (errorCount >= MAX_ERROR) {
        console.error('storage error: maximum number of storage errors reached, exit');
        process.exit(-1);
    }
}

module.exports = {
    connect,
    get,
    recordError,
};
