const fp = require('fastify-plugin');
const storageService = require('../utils/storage_service');

async function prestart() {
    try {
        // 连接持久层
        const error = await storageService.connect({ iotgo: true, redisCache: true });
        if (error) {
            // eslint-disable-next-line no-console
            console.error('failed to connect storage', error);
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = fp(prestart);