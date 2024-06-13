const familyRouter = require('./family');
const userRouter = require('./user');

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
    fastify.register(familyRouter, { prefix: '/api/v1/family' });
    fastify.register(userRouter, { prefix: '/api/v1/user' });
}

module.exports = registerRouters;