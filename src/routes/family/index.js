const Joi = require('joi');
const { errorCode } = require('../../utils/constant');
const { verify } = require('../../utils/auth');
const addFamily = require('../../controller/family/add_family');
const { ValidationError } = require('joi');

//http header的校验结构
const headerSchema = Joi.object({
    'x-ck-nonce': Joi.string().alphanum().length(8),
    'authorization': Joi.string().pattern(/^Bearer\s[0-9a-f]+$/).required(),
    'content-type': Joi.string().valid('application/json', 'application/json; charset=utf-8'),
}).required().unknown(true);

async function check(req, res) {
    try {
        // 校验请求头
        const checkRes = headerSchema.validate(req.headers);
        if (checkRes.error) {
            return res.responseError(errorCode.paramsError, checkRes.error.message);
        }
        req.headers = checkRes.value;
        // 权限验证
        const authRes = await verify(req);
        if (authRes.error) {
            return res.responseError(authRes.error, authRes.msg);
        }
        req.authRes = authRes;
    } catch (error) {
        console.log('family check error', error);
        throw new Error(error);
    }
}
/**
 * 
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {*} opts 
 */
module.exports = async (fastify, opts) => {
    // 进入该模块接口前的校验
    fastify.addHook('preHandler', check);

    // 简写路由
    fastify.post('',
        {
            schema: {
                body: Joi.object({
                    'name': Joi.string().required(true),
                    'sort': Joi.number().strict().integer().min(1).max(2).required(true),
                    'roomNameList': Joi.array().items(Joi.string()).default([]),
                }).required().unknown(true),
            },
        }, addFamily);

    // 完整路由
    fastify.route({
        method: 'GET',
        url: '/test',
        handler: async (req, res) => {
            return 'family test';
        },
    });

};