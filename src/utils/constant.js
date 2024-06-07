module.exports = {
    //api协议中定义的http header的key
    headersKey: {
        appid: 'x-ck-appid',
        nonce: 'x-ck-nonce',
        seq: 'x-ck-seq',
        authorization: 'authorization',
    },

    //通用错误码
    errorCode: {
        noError: 0,  //无错误
        paramsError: 400,  //参数错误，通常是缺少接口必须的参数，或者参数的类型或值错误
        accessTokenError: 401,  //access token认证错误，通常是账号被其他人登录，导致当前access token失效
        accessTokenExpired: 402,  //access token过期
        apiNotFound: 403,  //找不到接口，通常是接口url写错
        resourceNotFound: 405,  //找不到资源，通常是在后端数据库中查不到必需的数据记录
        deny: 406,  //拒绝操作，通常是当前用户无权操作指定资源
        unauthorizedAppID: 407,  //使用的appid无权调用该接口
        appidExpired: 408,  //appid已过期
        qrCodeExpired: 409, //二维码已过期
        qrCodeNotHere: 410, //二维码不在本区域
        qrCodeAlreadyUsed: 411, //二维码已被使用
        invokeTooMuch: 412, //调用次数过多
        seqExpired: 413, //签名时间戳过期
        businessBusy: 414,    //业务繁忙
        internalError: 500,  //lambda内部错误，通常是lambda的接口代码出错
        otherInternalServiceError: 510,   //lambda调用公司内部的其他服务（比如智能场景）出错引起的错误，
        mongodbError: 511,   //数据库读写异常
        duplicateIndexError: 512,//由于唯一索引导致写数据库失败
        reachESError: 513,//访问ES数据失败
        otherExternalServiceError: 520, //lambda调用外部服务（比如友盟）出错引起的错误
    },
};