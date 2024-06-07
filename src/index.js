const storage = require('./storage');
const fastify = require('fastify')({ logger: true });
const routes = require('./routes');
const { checkCROS } = require('./utils/cors');
const logger = require('./utils/logger');
const config = require('./config');
const injectCtx = require('./utils/injectCtx');
const { errorCode } = require('./utils/constant');
const fpx = require('fast-xml-parser');
const xmlParser = new fpx.XMLParser();
const { apiLog } = require('./utils/send2Kinesis');

const validContentTypes = new Set(['application/json', 'application/json; charset=utf-8']);
const ignoredPaths = [
    /^\/v2\/device\/migrate/,
    /^\/v2\/user\/zendesk\/check$/,
    /^\/v2\/message\/zendesk-push$/,
    /^\/v2\/utils\/(huawei|xiaomi)\/push\/message-receipt$/,
    /^\/v2\/weixin\/.*$/,
];
//支付相关的云端通知路径
const purchaseNotifyApi = [
    '/apiv2/purchase/google/notification',
    // '/apiv2/purchase/apple/notification',
];

async function prestart() {
    try {
        // 连接持久层
        await storage.connectV3({ iotgo: true, redisCache: true });
    } catch (error) {
        throw new Error('init failed');
    }
}

// 所有请求开始处理前
const beforeRequest = async (req, res) => {
    // 请求开始时记录时间
    req.startTs = new Date().getTime();

    //如果header有nonce，记录下来
    const nonce = req.headers['x-ck-nonce'];
    if (nonce) {
        req.nonce = nonce;
    }

    //向request和response对象注入方法
    injectCtx(req, res);
};

// 请求业务处理之前
const beforeHandler = async (req, res) => {
    //如果是post或者put请求，将内容转换成json
    if (req.method === 'POST' || req.method === 'PUT') {
        //没有带上json的header，返回错误
        //但如果是 /v2/device/migrate/*，则是从旧接口迁移过来的，有些调用没有传content-type，所以这里做一个过滤
        if (!ignoredPaths.some(ignorePath => ignorePath.test(req.url)) && !validContentTypes.has(req.headers['content-type'])) {
            return res.responseError(errorCode.paramsError, 'invalid content-type');
        }

        try {
            //如果是来自wx服务端的请求，将xml转为json
            if (req.url.indexOf('/v2/weixin/public-account') >= 0) {
                req.body = xmlParser.parse(req.body).xml;
            } else if (req.body && typeof req.body === 'string') {
                //检查是否是合法的json字符串
                req.body = JSON.parse(req.body);
            }
        } catch (error) {
            return res.responseError(errorCode.paramsError, 'invalid structure content');
        }
    }
};


// 所有请求返回结果前
const beforeResponse = async (req, res) => {

    //检查跨域设置，如果需要，会设置允许跨域的header
    checkCROS(req, res);

    // 请求接收到响应的时间
    req.duration = res.elapsedTime;

    //支付云端通知，默认statusCode是403
    if (purchaseNotifyApi.includes(req.url) && req.method !== 'OPTIONS') {
        res.statusCode = 403;
    }

    //记录api调用结果
    await apiLog(req, res);

    // 记录日志
    logger.flush();

};



const start = async () => {
    try {
        // 初始化数据库
        fastify.register(prestart);

        // 初始化路由
        fastify.register(routes);

        // 全局注册中间件，应用到所有路由
        fastify.addHook('onRequest', beforeRequest);
        fastify.addHook('preHandler', beforeHandler);
        fastify.addHook('onSend', beforeResponse);

        // 全局错误处理
        fastify.setErrorHandler(errorHandler);

        // 监听3000端口
        fastify.listen(3000, '0.0.0.0', (error, address) => {
            if (error) {
                fastify.log.error(error);
                process.exit(1);
            }
            fastify.log.info(`Server listening at ${address}`);
        });
    } catch (error) {
        if (error === 'init failed') {
            logger.error('init failed');
        }
        process.exit(1);
    }
};

function errorHandler(error, req, res) {
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError' || error.name === 'MongoError') {
        //mognodb服务读写错误
        const msg = `mongodb error: ${error.errmsg || error.toString()}`;
        logger.statistics(config.kinesisCategory.commonError, {
            api: `${req.method}@${req.url}`,
            msg,
        });

        if (error.code === 11000) {
            //由于唯一索引导致插入失败
            res.code(200).responseError(errorCode.duplicateIndexError, 'internal error');
        } else {
            //存储模块读写错误计数
            // storageService.recordError();
            res.code(200).responseError(errorCode.mongodbError, 'internal error');
        }
    } else {
        let msg = undefined;
        if (error instanceof Error) {
            msg = error.stack;
        } else if (typeof error === 'object') {
            msg = JSON.stringify(error);
        } else if (typeof error === 'string') {
            msg = error;
        }
        logger.statistics(config.kinesisCategory.commonError, {
            api: `${req.method}@${req.url}`,
            msg,
        });
        res.code(200).responseError(errorCode.internalError);
    }
}

(async () => {
    await start();
})();