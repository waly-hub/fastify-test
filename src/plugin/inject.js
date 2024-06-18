const fp = require('fastify-plugin');
const { responseOk, responseError, responseCustome, directResponse } = require('../utils/response');
const config = require('../config');
const constant = require('../utils/constant');
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 */
async function decoratePlugin(fastify) {
    // 声明全局通用模块的命名空间
    fastify.decorate('config', config); // 在上下文中通过req.server.config引用到config模块
    fastify.decorate('constant', constant);// 在上下文中通过req.server.constant引用到constant模块

    // 装饰请求对象，声明上下文会话对象
    fastify.decorateRequest('duration', 0);
    fastify.decorateRequest('nonce', '');
    fastify.decorateRequest('appid', '');
    fastify.decorateRequest('apikey', '');
    fastify.decorateRequest('deviceid', '');
    fastify.decorateRequest('authRes', null);

    // 装饰返回对象
    fastify.decorateReply('responseOk', responseOk);
    fastify.decorateReply('responseError', responseError);
    fastify.decorateReply('responseCustome', responseCustome);
    fastify.decorateReply('directResponse', directResponse);
}

module.exports = fp(decoratePlugin);