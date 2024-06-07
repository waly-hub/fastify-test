/**
 * 使用redis get/set 命令的缓存
 */
const KeyCache = require('./key_cache.js');
//默认的缓存过期时间，单位秒
const defaultTimeout = 120;

class GetCache extends KeyCache {
    constructor({ redisClient, prefix, timeout }) {
        super({ redisClient, prefix });
        this.timeout = timeout || defaultTimeout;
    }

    async get(id) {
        const key = this.prefix + id;
        const res = await this.redisClient.command('GET', key);
        // if (!res) {
        //     console.warn('GetCache miss:', key);
        // }
        return res;
    }

    async set(id, str, ttl) {
        const key = this.prefix + id;
        //如果传入ttl，则覆盖原来的，单位秒
        await this.redisClient.command('SETEX', key, ttl || this.timeout, str);
    }

    async setWithoutTtl(id, str) {
        const key = this.prefix + id;
        await this.redisClient.command('SET', key, str);
    }

    async incrBy(id, num) {
        const key = this.prefix + id;
        return await this.redisClient.command('INCRBY', key, num);
    }

    async delete(id) {
        const key = this.prefix + id;
        await this.redisClient.command('DEL', key);
    }

    async getTTL(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('TTL', key);
    }

    /**
     * 设置锁
     * @param {String} id 唯一id
     * @param {String} value
     * @param {Number} ttl 
     */
    async setNX(id, value, ttl) {
        const key = this.prefix + id;
        return await this.redisClient.command('SET', key, value, 'ex', ttl, 'nx');
    }
}

module.exports = GetCache;
