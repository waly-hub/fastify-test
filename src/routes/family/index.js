const { getFamily } = require('../../controller/family');
async function check(request, reply) {
    console.log('进入family模块');
}
module.exports = async (fastify, opts) => {
    // 进入该模块接口前的校验
    fastify.addHook('preHandler', check);
    // 简写路由
    fastify.get('/getFamily', getFamily);
    // 完整路由
    fastify.route({
        method: 'GET',
        url: '/test',
        handler: async (req, res) => {
            return 'family test';
        },
    });

};