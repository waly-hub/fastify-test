const config = require('../config');
const logger = require('./logger');

async function apiLog(req, res) {
    //打印执行结果
    // let logStr = `${req.method} | ${req.url} | ${res.error} | ${req.duration}`;
    // if (req.nonce) {
    //     logStr += ` | ${req.nonce}`;
    // }

    //向kinesis发送日志
    if (config.kinesisLog.enable) {
        await _send2Kinesis(req, res);
    }
}

async function _send2Kinesis(req, res) {
    if (req.method === 'OPTIONS') {
        //OPTIONS的请求不记录日志
        return;
    }
    let userAgent = undefined;
    let ip = undefined;
    if (req.headers) {
        userAgent = req.headers['user-agent'];
        const ipList = req.headers['x-forwarded-for'];
        // 如果是通过wss2http调用，直接使用请求头中的原始ip
        ip = req.headers['x-ck-origin-ip'];
        //x-forwarded-for 中可能会有多个ip（比如从nginx中调用来时，带着 x-forwarded-for），以逗号分隔
        //这里取第一个ip
        if (!ip && ipList) {
            ip = ipList.split(',')[0];
        }
    }
    //确保传入的字符串要么有值，要么为空，不能为null或空字符串
    logger.statistics(config.kinesisCategory.overview, {
        // TODO: functionName
        // function: res.functionName,
        method: req.method,
        path: req.url,
        api: `${req.method}@${req.url}`,
        userAgent,
        ip,
        error: res.error,
        msg: res.msg || undefined,
        duration: req.duration,
        nonce: req.nonce || undefined,
        appid: req.appid || undefined,
        apikey: req.apikey || undefined,
        deviceid: req.deviceid || undefined,
        // TODO: awsRequestId
        // reqId: req.awsRequestId,
        date: new Date().toISOString(),
    });
    console.log('res.error', res.error);

    await logger.flush();
}

module.exports = {
    apiLog,
};