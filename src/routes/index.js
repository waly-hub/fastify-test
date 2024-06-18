const fp = require('fastify-plugin');
const familyRouter = require('./family');
const userRouter = require('./user');
const { ValidationError } = require('joi');

async function registerRouters(fastify) {
    // http OPTIONS请求，一般是跨域调用时会有，直接返回空的成功信息
    fastify.route({
        method: 'OPTIONS',
        url: '*', // 匹配所有路径
        handler: (req, res) => {
            // 返回200状态码，表示预检请求已成功处理
            res.send(200);
        },
    });

    // 注册所有路由的校验器
    fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
        return data => {
            const ret = schema.validate(data);
            if (ret.error) {
                throw new ValidationError(ret.error);
            }
            return ret;
        };
    });

    fastify.register(familyRouter, { prefix: '/v2/family' });
    fastify.register(userRouter, { prefix: '/v2/user' });
}

module.exports = fp(registerRouters);