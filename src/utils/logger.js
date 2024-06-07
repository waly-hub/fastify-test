/* eslint-disable no-console */
const config = require('../config');
const { enable, region, streamName } = config.kinesisLog;
const kinesisUtils = require('./aws/kinesis');

const maxPutRecord = 64;  //最多一次推送的记录数

let putTimeout = config.kinesisLog.putTimeout;

let logList = [];

async function init() {
}

/**
 * 设置 kinesis put 超时
 * @param {Number} t 
 */
function setTimeout(t) {
    if (t) {
        putTimeout = t;
    }
}

/**
 * 
 * @param {String} msg 
 * @param {String} nonce 
 */
function debug(msg, nonce) {
    //非测试环境不保存debug日志
    if (!enable || !config.isTest) return;
    _developLog('debug', msg, nonce);
}

/**
 * 
 * @param {String} msg 
 * @param {String} nonce 
 */
function info(msg, nonce) {
    if (!enable) return;
    _developLog('info', msg, nonce);
}

/**
 * 
 * @param {String} msg 
 * @param {String} nonce 
 */
function warn(msg, nonce) {
    if (!enable) return;
    _developLog('warn', msg, nonce);
}

/**
 * 
 * @param {String} msg 
 * @param {String} nonce 
 */
function error(msg, nonce) {
    if (!enable) return;
    _developLog('error', msg, nonce);
}

/**
 * 
 * @param {String} category 
 * @param {Object} message 
 */
function statistics(category, message) {
    if (!enable) return;
    if (typeof message !== 'object') {
        message = { message };
    }
    _pushLog(category, message);
}

function _developLog(level, msg, nonce) {
    const message = { level, date: (new Date()).toISOString() };

    const t = typeof msg;
    if (t === 'object') {
        message.msg = JSON.stringify(msg);
    } else if (t !== 'string') {
        message.msg = msg.toString();
    } else {
        message.msg = msg;
    }

    if (nonce) {
        message.nonce = nonce;
    }
    _pushLog(config.kinesisCategory.develop, message);
}

function _pushLog(category, message) {
    message['@CKCategory'] = category;
    logList.push(message);
}

async function flush() {
    if (!enable) {
        return;
    }

    try {
        const partitionKey = Date.now().toString();
        //转换成推送时需要的格式
        if (logList.length === 0) {
            return;
        }

        const records = logList.map(function (item) {
            return { Data: Buffer.from(JSON.stringify(item)), PartitionKey: partitionKey };
        });
        const length = records.length;
        if (length <= maxPutRecord) {
            //一次推送
            await _put2Kinesis(records);
        } else {
            //多次推送
            let pos = 0;
            let list;
            while (pos < length) {
                list = records.slice(pos, pos + maxPutRecord);
                await _put2Kinesis(list);
                pos += maxPutRecord;
            }
        }
    } catch (err) {
        console.error('failed to put log to kinesis', err);
    }
    logList = [];
}

async function _put2Kinesis(records) {
    try {
        //给推送日志设置超时
        await Promise.race([
            _doPut(records),
            _timeout(putTimeout),
        ]);
    } catch (err) {
        console.warn('_put2Kinesis wrong:', err);
    }
}

async function _doPut(records) {
    const begin = new Date();
    await kinesisUtils.putRecords(records, streamName);
    const end = new Date();
    return end - begin;
}

function _timeout(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('put kinesis too long');
        }, t);
    });
}

module.exports = {
    //初始化
    init,
    setTimeout,

    //将日志推到kinesis中
    flush,

    //开发使用的日志
    debug,
    info,
    warn,
    error,

    //用于统计的日志
    statistics,
};
