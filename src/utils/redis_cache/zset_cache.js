/**
 * 使用redis zset 结构的缓存
 */
const KeyCache = require('./key_cache');

//默认的缓存过期时间，单位秒
const defaultTimeout = 120;

class ZsetCache extends KeyCache {
    constructor({ redisClient, prefix, timeout }) {
        super({ redisClient, prefix });
        this.timeout = timeout || defaultTimeout;
    }

    //设置多个项
    async addMembers(id, memberInfoList, ttl) {
        const key = this.prefix + id;
        const list = [];
        for (const { score, member } of memberInfoList) {
            if (score === null || score === undefined || member === null || member === undefined) {
                continue;
            }
            list.push(score);
            list.push(member);
        }
        if (list.length <= 0) {
            // console.warn('add zset error, item list empty');
            return;
        }
        //TODO 如果列表过长，应考虑分批设置
        await this.redisClient.command('ZADD', key, ...list);
        await this.redisClient.command('EXPIRE', key, ttl || this.timeout);
    }

    async delMembers(id, memberList, ttl) {
        const key = this.prefix + id;
        //TODO 如果列表过长，应考虑分批设置
        await this.redisClient.command('ZREM', key, ...memberList);
        await this.redisClient.command('EXPIRE', key, ttl || this.timeout);
    }

    //取得一个项的排序号
    async getScore(id, member) {
        const key = this.prefix + id;
        let [find, scoreStr] = await Promise.all([
            this.redisClient.command('EXISTS', key),
            this.redisClient.command('ZSCORE', key, member),
        ]);
        // if (!find) {
        //     console.warn('ZsetCache miss:', key);
        // }
        let score = scoreStr ? Number(scoreStr) : null;
        return { find, score };
    }

    //取得所有项的数量
    async getCount(id) {
        const key = this.prefix + id;
        let [find, count] = await Promise.all([
            this.redisClient.command('EXISTS', key),
            this.redisClient.command('ZCARD', key),
        ]);
        // if (!find) {
        //     console.warn('ZsetCache miss:', key);
        // }
        return { find, count };
    }

    async getTtl(id) {
        const key = this.prefix + id;
        return await this.redisClient.command('TTL', key);
    }

    async resetTtl(id, ttl) {
        const key = this.prefix + id;
        await this.redisClient.command('EXPIRE', key, ttl || this.timeout);
    }

    //取得最小项
    async getMinMember(id) {
        const key = this.prefix + id;
        let member = null;
        let score = null;
        let [find, memberInfo] = await Promise.all([
            this.redisClient.command('EXISTS', key),
            this.redisClient.command('ZRANGEBYSCORE', key, '-inf', '+inf', 'WITHSCORES', 'LIMIT', 0, 1),
        ]);
        if (!find) {
            //如果key不存在，直接返回
            return { find, member, score };
        }
        if (memberInfo && memberInfo.length >= 2) {
            member = memberInfo[0];
            score = Number(memberInfo[1]);
        } else {
            score = 0;
        }
        return { find, member, score };
    }

    //取得最大项
    async getMaxMember(id) {
        const key = this.prefix + id;
        let member = null;
        let score = null;
        let [find, memberInfo] = await Promise.all([
            this.redisClient.command('EXISTS', key),
            this.redisClient.command('ZREVRANGEBYSCORE', key, '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1),
        ]);
        if (!find) {
            //如果key不存在，直接返回
            return { find, member, score };
        }
        if (memberInfo && memberInfo.length >= 2) {
            member = memberInfo[0];
            score = Number(memberInfo[1]);
        }
        return { find, member, score };
    }

    //升序获取项目
    async getMembers(id, min, num) {
        const key = this.prefix + id;
        const find = await this.redisClient.command('EXISTS', key);
        if (!find) {
            //如果key不存在，直接返回
            // console.warn('ZsetCache miss:', key);
            return { find, memberList: [] };
        }

        let score;
        if (min === null || min === undefined) {
            //如果min为空（不是0），则取无限小
            score = '-inf';
        } else {
            //否则取score的闭区间，即取到项的score不小于min
            score = `(${min}`;
        }

        let res;
        if (!num) {
            res = await this.redisClient.command('ZRANGEBYSCORE', key, score, '+inf', 'WITHSCORES');
        } else {
            res = await this.redisClient.command('ZRANGEBYSCORE', key, score, '+inf', 'WITHSCORES', 'LIMIT', 0, num);
        }

        const memberList = [];
        for (let i = 0; i < res.length; i += 2) {
            memberList.push({
                member: res[i],
                score: Number(res[i + 1]),
            });
        }
        return { find, memberList };
    }

    //删除缓存
    async delete(id) {
        const key = this.prefix + id;
        await this.redisClient.command('del', key);
    }

    /**
     * 添加成员
     * @param {string} id 
     * @param {Object[]} members
     * @param {number} members.score
     * @param {string} members.member
     * @returns {number} 创建的新成员数量
     */
    async zadd(id, members) {
        const list = [];
        for (const { score, member } of members) {
            if (score == null || member == null) {
                continue;
            }
            list.push(score);
            list.push(member);
        }
        if (list.length <= 0) {
            // console.warn('add zset error, item list empty');
            return 0;
        }
        return this.redisClient.command('ZADD', this.prefix + id, ...list);
    }

    /**
     * 获取score段内的数据，返回的数据是 score 升序排列
     * @param {string} id
     * @param {number} [start] - 最小score，默认-inf
     * @param {number} [end] - 最大score，默认+inf
     * @returns {Promise<{ member: string, score: number }[]>}
     */
    async zrangeByScore(id, start, end) {
        let max = '+inf', min = '-inf';
        if (start != null) min = `${start}`;
        if (end != null) max = `${end}`;

        const result = await this.redisClient.command('ZRANGEBYSCORE', this.prefix + id, min, max, 'WITHSCORES');
        const list = [];
        for (let i = 0; i < result.length; i += 2) {
            list.push({
                member: result[i],
                score: Number(result[i + 1]),
            });
        }

        return list;
    }

    /**
     * 删除score段内的数据，返回的是删除的数量
     * @param {string} id
     * @param {number} [start] - 最小score，默认-inf
     * @param {number} [end] - 最大score，默认+inf
     * @returns {Promise<number>}
     */
    zremRangeByScore(id, start, end) {
        let max = '+inf', min = '-inf';
        if (start != null) min = `${start}`;
        if (end != null) max = `${end}`;

        return this.redisClient.command('ZREMRANGEBYSCORE', this.prefix + id, min, max);
    }
}

module.exports = ZsetCache;
