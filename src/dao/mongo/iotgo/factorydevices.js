const ObjectId = require('mongoose').Types.ObjectId;
const constant = require('../../../utils/constant');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const storage = require('../../../utils/storage_service').get();
const dbModel = storage.mongodb.iotgo.getCollection('factorydevices');

const GetCache = require('../../../utils/redis_cache/get_cache');
const cacheInstance = new GetCache({
    redisClient: storage.redis.cache,
    prefix: constant.redisCacheKey.fdPrefix,
    timeout: config.redisCacheTtl.fd,
});

async function add(deviceid, doc) {
    const fdInfo = await dbModel.create(doc);
    await cacheInstance.set(deviceid, JSON.stringify(fdInfo));
    return fdInfo;
}

/**
 * 查询指定deviceid的设备出厂信息
 * @param {String} deviceid 
 * @returns {Promise<FdInfo|null>}
 */
async function find(deviceid) {
    //从缓存中获取
    const cacheResult = await cacheInstance.get(deviceid);

    if (cacheResult) {
        try {
            const obj = JSON.parse(cacheResult);
            return transformCacheData(obj);
        } catch (e) {
            logger.error(`failed to parse fd cache:${e}`, 'fdDao');
            await cacheInstance.delete(deviceid);
        }
    }

    //从数据库中查找数据
    const dbResult = await dbModel.findOne({ deviceid }).lean();
    if (dbResult) {
        if (dbResult.extra?.uiid) {
            dbResult.extra.uiid = parseInt(dbResult.extra.uiid);
        }
        const objStr = JSON.stringify(dbResult);
        //设置缓存
        await cacheInstance.set(deviceid, objStr);
        return transformCacheData(JSON.parse(objStr));
    }
    return dbResult;
}

async function findMany(condition, projection = null, option = null) {
    const fds = await dbModel.find(condition, projection, option).lean();
    for (const fd of fds) {
        if (fd.extra && fd.extra.uiid) fd.extra.uiid = parseInt(fd.extra.uiid);
    }
    return fds;
}

async function findByCondition(condition) {
    //从数据库中查找数据
    const dbResult = await dbModel.findOne(condition).lean();
    if (dbResult) {
        //设置缓存
        await cacheInstance.set(dbResult.deviceid, JSON.stringify(dbResult));
    }
    return dbResult;
}

async function findByConditionAndOption(condition, option) {
    //从数据库中查找数据
    const dbResult = await dbModel.find(condition, null, option).lean();
    return dbResult;
}

async function update(deviceid, condition, update) {
    const fdInfo = await dbModel.findOneAndUpdate(condition, update, { new: true }).lean();
    if (fdInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(fdInfo));
    } else {
        logger.warn('failed to update fd to mongodb', 'fdDao');
    }
    return fdInfo;
}

async function remove(deviceid) {
    await Promise.all([
        dbModel.deleteOne({ deviceid }),
        cacheInstance.delete(deviceid),
    ]);
}

// 为使用指针
function findManyByConditionCursor(condition) {
    return dbModel.find(condition).cursor();
}


//对缓存中取出的数据做转换
function transformCacheData(obj) {
    if (obj._id) obj._id = new ObjectId(obj._id);
    if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
    if (obj.expiredAt) obj.bindAt = new Date(obj.expiredAt);
    if (obj.extra) {
        if (obj.extra.uiid) obj.extra.uiid = parseInt(obj.extra.uiid);
        if (obj.extra.modelInfo) obj.extra.modelInfo = new ObjectId(obj.extra.modelInfo);
        if (obj.extra.brandId) obj.extra.brandId = new ObjectId(obj.extra.brandId);
    }
    return obj;
}

/**
 * 以下是实施 DevOps 以来增加的新方法
 */

/**
 * @typedef {Object} FdInfo
 * @property {ObjectId} _id
 * @property {String} deviceid - 设备id
 * @property {String} apikey - 设备apikey
 * @property {Object} extra
 * @property {String} extra.ui - 设备ui
 * @property {Number} extra.uiid
 * @property {String} extra.mac
 * @property {String} extra.apmac
 * @property {String} extra.model - 模块型号
 * @property {String} extra.description
 * @property {ObjectId} extra.modelInfo - 产品型号_id
 * @property {String} extra.manufacturer - 产品厂家
 * @property {ObjectId} extra.brandId - 品牌_id
 * @property {String} extra.chipid - 芯片id
 * @property {Date} createdAt
 */

/**
 * 查询指定批量设备id的设备出厂数据
 * @param {String[]} deviceids - 设备id数组
 * @param {{[fieldName: string]: 1|0}} [projection]
 * @return {Promise<FdInfo[]>}
 */
async function findManyByDeviceid(deviceids, projection) {
    const findParams = [{ deviceid: { $in: deviceids } }];
    if (projection) findParams.push(projection);
    const fdInfos = await dbModel.find(...findParams).lean();
    for (const fdInfo of fdInfos) {
        if (fdInfo.extra?.uiid) fdInfo.extra.uiid = parseInt(fdInfo.extra.uiid);
    }
    return fdInfos;
}

/**
 * 根据设备唯一识别码获取出厂数据
 * @param {String} uniqueId - 唯一识别码
 * @return {Promise<FdInfo>} - 出厂数据
 */
async function findByUniqueId(uniqueId) {
    const fdInfo = await dbModel.findOne({ 'partnerDevice.ezVedioSerial': uniqueId }).lean();
    return fdInfo;
}

/**
 * 根据设备唯一识别码获取出厂数据
 * @param {String} uniqueId - 唯一识别码
 * @return {Promise<FdInfo>} - 出厂数据
 */
async function updateApikeyByDeviceId(deviceid, newApikey) {
    const fdInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { apikey: newApikey } }, { new: true }).lean();
    return fdInfo;
}


module.exports = {
    add,
    find,
    findMany,
    update,
    remove,
    findByCondition,
    findByConditionAndOption,
    findManyByConditionCursor,

    //以下是实施 DevOps 以来增加的新方法
    findManyByDeviceid,
    findByUniqueId,
    updateApikeyByDeviceId,
};
