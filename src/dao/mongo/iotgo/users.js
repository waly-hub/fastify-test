const ObjectId = require('mongoose').Types.ObjectId;
const constant = require('../../../utils/constant');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const storage = require('../../../utils/storage_service').get();
const dbModel = storage.mongodb.iotgo.getCollection('users');

const GetCache = require('../../../utils/redis_cache/get_cache');
const cacheInstance = new GetCache({
    redisClient: storage.redis.cache,
    prefix: constant.redisCacheKey.userPrefix,
    timeout: config.redisCacheTtl.user,
});


async function add(doc) {
    const userInfo = await dbModel.create(doc);
    await cacheInstance.set(userInfo.apikey, JSON.stringify(userInfo));
    return userInfo;
}

// 为使用指针
function findManyByConditionCursor(condition) {
    return dbModel.find(condition).cursor();
}

async function findByCondition(condition) {
    //从数据库中查找数据
    const dbResult = await dbModel.findOne(condition).lean();
    if (dbResult) {
        //设置缓存
        await cacheInstance.set(dbResult.apikey, JSON.stringify(dbResult));
    }
    return dbResult;
}

async function findManyByCondition(condition) {
    //从数据库中查找数据
    const dbResult = await dbModel.find(condition).lean();
    return dbResult;
}

/**
 * 通过apikey查询用户信息
 * @param {string} apikey 
 * @returns {Promise<UserInfo|null>}
 */
async function find(apikey) {
    //从缓存中获取
    const cacheResult = await cacheInstance.get(apikey);
    if (cacheResult) {
        try {
            const obj = JSON.parse(cacheResult);
            return transformCacheData(obj);
        } catch (e) {
            logger.error(`failed to parse user cache:${e}`, 'userDao');
            await cacheInstance.delete(apikey);
        }
    }

    //从数据库中查找数据
    const dbResult = await dbModel.findOne({ apikey }).lean();
    if (dbResult) {
        //设置缓存
        await cacheInstance.set(apikey, JSON.stringify(dbResult));
    }
    return dbResult;
}

async function update(apikey, condition, update) {
    const userInfo = await dbModel.findOneAndUpdate(condition, update, { new: true }).lean();
    if (userInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(apikey, JSON.stringify(userInfo));
    } else {
        logger.warn(`failed to update user to mongodb,update:${JSON.stringify({ apikey, condition, update })}`, 'userDao');
    }
    return userInfo;
}

async function upsert(apikey, condition, update) {
    const userInfo = await dbModel.findOneAndUpdate(condition, update, { upsert: true, new: true }).lean();
    if (userInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(apikey, JSON.stringify(userInfo));
    } else {
        logger.warn('failed to upsert user to mongodb', 'userDao');
    }
    return userInfo;
}

async function remove(apikey) {
    await Promise.all([
        dbModel.deleteOne({ apikey }),
        cacheInstance.delete(apikey),
    ]);
}

//对缓存中取出的数据做转换
function transformCacheData(obj) {
    if (obj) {
        if (obj._id) obj._id = new ObjectId(obj._id);
        if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
        if (obj.bindAt) obj.bindAt = new Date(obj.bindAt);
        if (obj.weixinInfo && obj.weixinInfo.subscribe_time) obj.weixinInfo.subscribe_time = new Date(obj.weixinInfo.subscribe_time);
        if (obj.currentFamilyId) obj.currentFamilyId = new ObjectId(obj.currentFamilyId);
        if (obj.accountInfo && obj.accountInfo.validAt) obj.accountInfo.validAt = new Date(obj.accountInfo.validAt);
        if (obj.accountInfo && obj.accountInfo.expiredAt) obj.accountInfo.expiredAt = new Date(obj.accountInfo.expiredAt);
        if (obj.extra?.freeTrialExpiredAt) obj.extra.freeTrialExpiredAt = new Date(obj.extra.freeTrialExpiredAt);
        if (obj.extra?.historyClearTime?.msgCenter) obj.extra.historyClearTime.msgCenter = new Date(obj.extra.historyClearTime.msgCenter);
    }
    return obj;
}

/**
 * 以下是实施 DevOps 以来增加的新方法
 */

/**
 * @typedef ExtraPush
 * @property {string} type - 推送通道名称
 * @property {Object} info
 * @property {string} info.token - 手机设备在推送通道的唯一标识
 */

/**
 * @typedef ClientInfo
 * @property {string} model - 手机型号
 * @property {string} os - 操作系统
 * @property {string} imei - 手机imei
 * @property {string} romVersion - 操作系统版本
 * @property {string} appVersion - App应用版本
 */

/**
 * 罗列的属性是比较常用的，具体结构见 Mongoose Schema
 * @typedef UserInfo
 * @property {ObjectId} _id
 * @property {string} nickname - 昵称
 * @property {string} apikey - 用户唯一键
 * @property {string} [email] - 邮箱，与phoneNumber必有1个
 * @property {string} [phoneNumber] - 手机号
 * @property {string} password
 * @property {string} appId - 注册平台
 * @property {"cn"|"en"} lang - 语言，用于推送通知等
 * @property {boolean} [isAccepEmailAd] - 接受邮件订阅
 * @property {string} countryCode - 国家码 
 * @property {ObjectId} currentFamilyId - 当前家庭id
 * @property {ClientInfo} clientInfo - 用户当前使用的App客户端信息
 * @property {Object} accountInfo
 * @property {10|20|30} accountInfo.level - 会员等级；10=Free，20=Advances，30=Pro
 * @property {Date} [accountInfo.validAt] - 生效时间
 * @property {Date} [accountInfo.expiredAt] - 过期时间
 * @property {Object} extra
 * @property {boolean} [extra.appForumEnterHide] - App社区入口白名单设置，false=不隐藏入口
 * @property {{[appid: string]: ExtraPush}} extraPush - 推送通道配置
 * @property {string} language - 多语种语言
 * @property {Date} createdAt - 注册时间
 */

/**
 * 通过邮件和手机号查找用户，手机号不为空时优先手机号
 * @param {String} [email] - 邮箱
 * @param {String} [phone] - 手机号
 * @param {String} [uns] - appid对应的命名空间
 * @returns {Promise<UserInfo|null>}
 */
async function findUserByEmailOrPhone(email, phone, uns) {
    if (!email && !phone) return null;
    const conditions = phone ? { phoneNumber: phone } : { email: email.toLowerCase() };
    conditions.uns = uns ?? { $exists: false };
    //从数据库中查找数据
    const dbResult = await dbModel.findOne(conditions).lean();
    return dbResult;
}

/**
 * 通过微信unionid查找用户（过渡阶段使用）
 * @param {String} unionId - unionid
 * @returns {Promise<Array<UserInfo>>}
 */
async function findManyByUnioinId(unionId) {
    //从数据库中查找数据
    const dbResultArr = await dbModel.find({ 'mpInfos.unionid': unionId }).lean();
    return dbResultArr;
}

/**
 * 切换用户当前家庭
 * @param {string} apikey 
 * @param {string | ObjectId} newFamilyId 
 * @returns {Promise<UserInfo|null>}
 */
async function switchCurrentFamily(apikey, newFamilyId) {
    const currentFamilyId = newFamilyId instanceof ObjectId ? newFamilyId : new ObjectId(newFamilyId);
    const userInfo = await dbModel.findOneAndUpdate({ apikey }, { $set: { currentFamilyId } }, { new: true }).lean();
    if (userInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(apikey, JSON.stringify(userInfo));
    } else {
        logger.warn(`failed to update user to mongodb,switchCurrentFamily:${JSON.stringify({ apikey, newFamilyId })}`, 'userDao');
    }
    return userInfo;
}

/**
 * 更新指定apikey用户
 * @param {string} apikey 
 * @param {Object.<string, any>} update 
 * @returns {Promise<UserInfo|null>}
 */
async function updateByApikey(apikey, update) {
    const userInfo = await dbModel.findOneAndUpdate({ apikey }, update, { new: true }).lean();
    if (userInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(apikey, JSON.stringify(userInfo));
    } else {
        logger.warn(`failed to update user to mongodb,updateByApikey:${JSON.stringify({ apikey, update })}`, 'userDao');
    }
    return userInfo;
}

/**
 * 删除指定微信用户的user内的微信信息
 * @param {string} unionId 
 * @param {Object.<string, any>} update 
 * @returns {Promise<UserInfo|null>}
 */
async function deleteUserMpInfosByUnionid(unionId) {
    const userInfoArr = await dbModel.find({ 'mpInfos.unionid': unionId }).lean();
    for (const userInfo of userInfoArr) {
        const newUserInfo = await dbModel.findOneAndUpdate({ apikey: userInfo.apikey }, {
            $unset: {
                mpInfos: 1,
            },
        }, { new: true });
        if (newUserInfo) {
            //更新成功，设置缓存
            await cacheInstance.set(userInfo.apikey, JSON.stringify(newUserInfo));
        } else {
            logger.warn(`failed to update user to mongodb,deleteUserMpInfosByUnionid:${unionId}`, 'userDao');
        }
    }
}

/**
 * 删除指定微信用户的user内的微信信息
 * @param {string} openId 第三方账号的唯一ID
 * @param {string} [uns] 命名空间
 * @returns {Promise<UserInfo|null>}
 */
async function findByOpenId(openId, uns) {
    const condition = {
        openId,
        uns: uns ? uns : { $exists: false },
    };

    const dbResult = await dbModel.findOne(condition).lean();
    return dbResult;
}

module.exports = {
    add,
    find,
    update,
    upsert,
    remove,
    findByCondition,
    findManyByCondition,
    findManyByConditionCursor,

    //以下是实施 DevOps 以来增加的新方法
    findUserByEmailOrPhone,
    switchCurrentFamily,
    updateByApikey,
    findManyByUnioinId,
    deleteUserMpInfosByUnionid,
    findByOpenId,
};  
