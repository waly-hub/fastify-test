class KeyCache {
    constructor({ redisClient, prefix }) {
        this.redisClient = redisClient;
        this.prefix = prefix;    //缓存的key的前缀
    }

    /**
     * 删除 key
     * @param {string} id 
     * @returns     被删除 key 的数量
     */
    async del(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('DEL', key);
    }

    /**
     * 判断 id 是否存在缓存
     * @param {string} id 
     * @returns  1 | 0   存在返回 1，不存在返回 0
     */
    async exists(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('EXISTS', key);
    }

    /**
     * 设置过期时间，可用于重置过期时间
     * @param {string} id 
     * @param {number} seconds      单位秒
     * @returns 1 | 0   成功返回 1，失败返回 0
     */
    async expire(id, seconds) {
        const key = this.prefix + id;
        return await this.redisClient.command('EXPIRE', key, seconds);
    }

    /**
     * 设置过期时间，可用于重置过期时间
     * @param {string} id 
     * @param {number} time unix-time-seconds
     * @returns 1 | 0 成功返回 1，失败返回 0
     */
    async expireAt(id, time) {
        const key = this.prefix + id;
        return await this.redisClient.command('EXPIREAT', key, time);
    }

    /**
     * 查询过期时间，单位秒
     * @param {string} id 
     * @returns {number} -2=key不存在；-1=Key没有设置ttl；剩余过期时间
     */
    async ttl(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('TTL', key);
    }
}

module.exports = KeyCache;
