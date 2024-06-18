/**
 * 使用redis hash 结构的缓存
 */

const KeyCache = require('./key_cache');

//默认的缓存过期时间，单位秒
const defaultTimeout = 120;

class HashCache extends KeyCache {
    constructor({ redisClient, prefix, timeout }) {
        super({ redisClient, prefix });
        this.timeout = timeout || defaultTimeout;
    }

    /**
     * 查询 hash 表里是否存在 field
     * @param {string} id 
     * @param {string} field 
     * @returns field 存在返回 1 | field 或 key 不存在返回 0
     */
    async hexists(id, field) {
        const key = this.prefix + id;
        return await this.redisClient.command('HEXISTS', key, field);
    }

    /**
     * 将 obj 缓存
     * @param {string} id 
     * @param {object} obj 
     * @returns 执行成功正常返回 | key 不是 hash 类型则抛错
     */
    async hmset(id, obj) {
        const key = this.prefix + id;
        return await this.redisClient.command('HMSET', key, obj);
    }

    /**
     * 将 hash 中指定的 field 的值设置为 value；不会重置 hash 的过期时间
     * @param {string} id 
     * @param {string} field 
     * @param {*} value 
     * @returns 
     */
    async hset(id, field, value) {
        const key = this.prefix + id;
        return await this.redisClient.command('HSET', key, field, value);
    }

    /**
     * 获取 hash 中所有 field 的值
     * @param {string} id 
     * @returns    总是返回一个 object
     */
    async hgetall(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('HGETALL', key);
    }

    /**
     * 获取 hash 中 field 的值
     * @param {string} id 
     * @returns    
     */
    hget(id, field) {
        const key = this.prefix + id;
        return this.redisClient.command('HGET', key, field);
    }
}

module.exports = HashCache;
