const userDao = require('../../dao/mongo/iotgo/users');
const logger = require('../../utils/logger');
module.exports = async (req, res) => {
    logger.info('fastify-test', 'user fastify-test');
    await userDao.find('10f35fd8-7ddd-4c5f-948f-3cf5facded9e');
    return res.status(200).send('get user');
};