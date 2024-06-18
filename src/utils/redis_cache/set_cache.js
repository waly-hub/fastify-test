/**
 * 使用redis set 结构的缓存
 */
const KeyCache = require('./key_cache');

//默认的缓存过期时间，单位秒
const defaultTimeout = 120;

class SetCache extends KeyCache {
    constructor({ redisClient, prefix, timeout }) {
        super({ redisClient, prefix });
        this.timeout = timeout || defaultTimeout;
    }

    /**
     * 向集合添加成员，支持批量添加
     * @param {String} id 
     * @param {...String} members 
     * @returns {Number} 被添加到集合中的元素的数量，不包括集合中已经存在的所有元素
     */
    async sadd(id, ...members) {
        const key = this.prefix + id;
        return this.redisClient.command('SADD', key, ...members);
    }

    /**
     * 获取集合的所有成员
     * @param {String} id 
     * @returns {String[]} 返回数组，元素是成员；当集合不存在，返回空数组
     */
    async smembers(id) {
        const key = this.prefix + id;
        return this.redisClient.command('SMEMBERS', key);
    }

    /**
     * 从集合中移除指定成员
     * @param {String} id 
     * @param  {...String} members 
     * @returns {Number} 从集合中删除的成员数量，不包括非现有成员
     */
    async srem(id, ...members) {
        const key = this.prefix + id;
        return this.redisClient.command('SREM', key, ...members);
    }
}

module.exports = SetCache;