const { responseOk, responseError, responseCustome, directResponse } = require('./response');

function injectCtx(req, res) {
    req._injectRequest = true;

    res.responseOk = responseOk;  //成功返回的封装方法
    res.responseError = responseError;  //错误返回的封装方法
    res.responseCustome = responseCustome;  //会经过封装的自定义响应
    res.directResponse = directResponse;  //不经过封装，直接返回响应
    res._injectResponse = true;
}

module.exports = injectCtx;