/**
 * 使用redis list 结构的缓存
 */
const KeyCache = require('./key_cache');
//默认的缓存过期时间，单位秒
const defaultTimeout = 120;

class ListCache extends KeyCache {
    constructor({ redisClient, prefix, timeout }) {
        super({ redisClient, prefix });
        this.timeout = timeout || defaultTimeout;
    }

    /**
     * 如果 key 列表不存在，创建它并设置过期时间。再从右插入新的值;
     * @param {string} id 
     * @param {string} value 
     */
    async rpush(id, value) {
        const key = this.prefix + id;
        const keyExists = this.exists(key);
        // 总是返回表长度
        const length = await this.redisClient.command('RPUSH', key, value);

        // 如果是一个新创的 key，设置过期时间
        if (!keyExists) await this.expire(id, this.timeout);

        return length;
    }

    /**
     * 增加多个值，如果 key 列表不存在，创建它并设置过期时间。再从右插入新的值;
     * @param {string} id 
     * @param {array} list 
     */
    async rpushMul(id, list) {
        const key = this.prefix + id;
        const keyExists = this.exists(key);
        // 总是返回表长度
        const length = await this.redisClient.command('RPUSH', key, ...list);

        // 如果是一个新创的 key，设置过期时间
        if (!keyExists) await this.expire(id, this.timeout);

        return length;
    }

    /**
     * 如果 key 列表不存在，创建它并设置过期时间。再从左插入新的值;
     * @param {string} id 
     * @param {string} value 
     * @returns {Promise<number>}
     */
    lpush(id, value) {
        let key;

        // 队列不一定有id，可能只是一个固定的值
        if (id) {
            key = this.prefix ? this.prefix + id : id;
        } else {
            key = this.prefix;
        }

        // 总是返回表长度
        return this.redisClient.command('LPUSH', key, value);
    }

    /**
     * 移除列表中与参数 value 相等的所有元素；
     * @param {string} id
     * @param {number} count  count > 0 表示从表头开始删除 count 个与 value 相等的元素； count < 0 表示从表尾开始删除 count绝对值个与 value 相等的元素； count = 0 表示删除所有与 value 相等的元素    
     * @param {string} value 
     */
    async lrem(id, count, value) {
        const key = this.prefix + id;
        // 总是返回被移除的 value 数量
        return await this.redisClient.command('LREM', key, count, value);
    }

    /**
     * 获取 key 列表的元素; 正常总返回 array
     * @param {string} id 
     * @param {number} start 
     * @param {number} end 
     * @returns array
     */
    async lrange(id, start, end) {
        const key = this.prefix + id;
        return await this.redisClient.command('LRANGE', key, start, end);
    }

    /**
     * 获取 key 列表的元素的长度
     * @param {string} id 
     * @returns array
     */
    async llen(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('LLEN', key);
    }
}

module.exports = ListCache;