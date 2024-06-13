const { getUser } = require('../../controller/user');
async function check(request, reply) {
    console.log('进入user模块');
}
module.exports = async (fastify, opts) => {
    // 进入该模块接口前的校验
    fastify.addHook('preHandler', check);
    // 简写路由
    fastify.get('/getUser', getUser);
    fastify.post('/getUser', (req, res) => {
        return res.responseOk({}, '获取成功');
        // throw new Error('this is a error');
    });
    // 完整路由
    fastify.route({
        method: 'GET',
        url: '/test',
        /**
         * @param {import('fastify').FastifyRequest} req 
         * @param {import('fastify').FastifyReply} res 
         * @returns 
         */
        handler: async (req, res) => {
            return res.responseOk({}, '获取成功');
        },
    });

};