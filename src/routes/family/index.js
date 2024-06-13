const Joi = require('joi');
const { errorCode } = require('../../utils/constant');
const { getFamily } = require('../../controller/family');

//http header的校验结构
const headerSchema = Joi.object({
    'x-ck-nonce': Joi.string().alphanum().length(8),
    'authorization': Joi.string().pattern(/^Bearer\s[0-9a-f]+$/).required(),
    'content-type': Joi.string().valid('application/json', 'application/json; charset=utf-8'),
}).required().unknown(true);

async function check(req, res) {
    const checkRes = headerSchema.validate(req.headers);
    if (checkRes.error) {
        return res.responseError(errorCode.paramsError, checkRes.error.message);
    }
    req.headers = checkRes.value;
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