const { errorCode } = require('./constant');

function _ok(data, msg) {
    return {
        error: errorCode.noError,
        msg: msg ?? '',
        data: (data === undefined || data === null) ? {} : data,
    };
}

function _error(error, msg, data) {
    return {
        error: error || errorCode.internalError,
        msg: msg || 'internal error',
        data: data || {},
    };
}

function responseOk(data, msg) {
    const obj = _ok(data, msg);
    this.send(obj);
}

function responseError(error, msg, data) {
    const obj = _error(error, msg, data);
    this.send(obj);
}

function responseCustome({ statusCode, body, ckResponse }) {
    this.header('Content-Type', 'application/json; charset=utf-8');
    this.send(body ?? '');
}

/**
 * 不经过封装，直接返回响应
 * @param {object} obj 
 * @param {Number} obj.error 
 * @param {string} obj.msg 
 * @param {string} obj.data 
 * @param {Number} obj.statusCode 
 */
function directResponse({ error, msg, data, statusCode }) {
    this.send(data ?? '');
}

module.exports = {
    ok: _ok,
    error: _error,
    responseOk,
    responseError,
    responseCustome,
    directResponse,
};
