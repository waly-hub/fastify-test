const ObjectId = require('mongoose').Types.ObjectId;
const constant = require('../../../utils/constant');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const storage = require('../../../utils/storage_service').get();
const dbModel = storage.mongodb.iotgo.getCollection('devices');

const GetCache = require('../../../utils/redis_cache/get_cache');
const cacheInstance = new GetCache({
    redisClient: storage.redis.cache,
    prefix: constant.redisCacheKey.devicePrefix,
    timeout: config.redisCacheTtl.device,
});

async function add(deviceid, doc) {
    const deviceInfo = await dbModel.create(doc);
    await cacheInstance.set(deviceid, JSON.stringify(deviceInfo));
    return deviceInfo;
}

async function findByCondition(condition) {
    const dbResult = await dbModel.find(condition).lean();
    if (dbResult) {
        for (const item of dbResult) {
            //设置缓存
            await cacheInstance.set(item.deviceid, JSON.stringify(item));
        }
    }
    return dbResult;
}

async function findByConditionWithProjection(condition, projection) {
    const dbResult = await dbModel.find(condition, projection).lean();
    return dbResult;
}

/**
 * 
 * @param {string} deviceid 
 * @returns {Promise<DeviceInfo|null>}
 */
async function find(deviceid) {
    //从缓存中获取
    const cacheResult = await cacheInstance.get(deviceid);

    if (cacheResult) {
        try {
            const obj = JSON.parse(cacheResult);
            return transformCacheData(obj);
        } catch (e) {
            logger.error(`failed to parse device cache:${e}`, 'deviceDao');
            await cacheInstance.delete(deviceid);
        }
    }

    //从数据库中查找数据
    const dbResult = await dbModel.findOne({ deviceid }).lean();

    if (dbResult) {
        //设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(dbResult));
    }
    return dbResult;
}



function findMany(condition, projection = null, option = null) {
    return dbModel.find(condition, projection, option).lean();
}

function findByRelation(deviceid, beginIndex, num, projection = null) {
    // todo
    // 目前在内存中处理分页，mongo还未找到合适的解决方案。
    num = 1000;
    return dbModel.find({
        'relational': {
            '$elemMatch': {
                'deviceid': deviceid,
                '$or': [{ 'index': { '$exists': false } }, { 'index': { '$gt': beginIndex } }],
            },
        },
    }, projection, {
        limit: num,
        // sort: { "relational.index": 1 }
    });
}

function removeRelations(deviceid, removeRelations) {
    if (removeRelations.length <= 0) return;
    update(deviceid, { deviceid: deviceid }, {
        $pull: { 'params.relational': { 'deviceid': { $in: removeRelations } } },
    });
}

async function findSubDevices(parentId, beginIndex, num, projection = null) {
    const device = await dbModel.findOne({ deviceid: parentId }).lean();
    const subDevices = await findMany({
        deviceid: {
            $in: device?.params?.subDevices?.filter(s => s.index > beginIndex || s.index === undefined)
                .map(s => s.deviceid)
                .slice(0, num),
        },
    });
    for (const sd of subDevices) {
        sd.index = device?.params?.subDevices?.find(s => s.deviceid === sd.deviceid)?.index;
    }
    return subDevices;
}

async function update(deviceid, condition, update) {
    const deviceInfo = await dbModel.findOneAndUpdate(condition, update, { new: true }).lean();
    if (deviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(deviceInfo));
    } else {
        logger.warn('failed to update device to mongodb', 'deviceDao');
    }
    return deviceInfo;
}

/**
 * 更新多个文档并返回更新后的文档
 * @param {Object.<string, *>} condition 
 * @param {Object.<string, *>} update 
 * @returns {Promise<DeviceInfo[]>}
 */
async function updateMany(condition, update) {
    await dbModel.updateMany(condition, update);

    const devices = await dbModel.find(condition).lean();
    //设置缓存
    for (const device of devices) {
        await cacheInstance.set(device.deviceid, JSON.stringify(device));
    }

    return devices;
}

async function remove(deviceid) {
    await Promise.all([
        dbModel.deleteOne({ deviceid }),
        cacheInstance.delete(deviceid),
    ]);
}


//对缓存中取出的数据做转换
function transformCacheData(obj) {
    if (obj._id) obj._id = new ObjectId(obj._id);
    if (obj.createdAt) obj.createdAt = new Date(obj.createdAt);
    if (obj.extra) {
        if (typeof obj.extra !== 'string') {
            //兼容旧程序的缓存
            obj.extra = new ObjectId(obj.extra._id);
        } else {
            obj.extra = new ObjectId(obj.extra);
        }
    }
    if (obj.onlineTime) obj.onlineTime = new Date(obj.onlineTime);
    if (obj.offlineTime) obj.offlineTime = new Date(obj.offlineTime);

    if (obj.family) {
        if (obj.family.id) obj.family.id = new ObjectId(obj.family.id);
        if (obj.family.room && obj.family.room.id) obj.family.room.id = new ObjectId(obj.family.room.id);
        if (obj.family.guests?.length > 0) {
            obj.family.guests.map(item => item.expiredAt = new Date(item.expiredAt));
        }
    }

    if (obj.shareUsersInfo) {
        for (const item of obj.shareUsersInfo) {
            if (item.shareDate) item.shareDate = new Date(item.shareDate);
            if (item.family && item.family.id) item.family.id = new ObjectId(item.family.id);
            if (item.family && item.family.room && item.family.room.id) item.family.room.id = new ObjectId(item.family.room.id);
            if (item.expiredAt) item.expiredAt = new Date(item.expiredAt);
        }
    }
    return obj;
}

/**
 * 以下是实施 DevOps 以来增加的新方法
 */

/**
 * V2接口设备分享的分享人数据
 * @typedef ShareUserInfo
 * @property {string} apikey - 接收分享的用户apikey
 * @property {number} permit - 权限
 * @property {Object} family - 家庭信息  
 * @property {ObjectId} family.id - 家庭id
 * @property {number} family.index - 分享设备在家庭的序号
 * @property {Object} [family.room] - 分享设备所在房间信息
 * @property {ObjectId} family.room.id - 房间id 
 * @property {string} comment - 分享备注
 * @property {Date} shareDate - 分享时间
 * @property {string} [platform] - 分享平台
 */

/**
 * 罗列的属性是常用数据，具体见Mongoose Schema
 * @typedef {Object} DeviceInfo
 * @property {ObjectId} _id
 * @property {string} name - 设备名称
 * @property {string} deviceid - 设备id
 * @property {string} type
 * @property {string} apikey - 主人apikey
 * @property {boolean} online - 在线状态；true=在线
 * @property {Date} onlineTime - 最近一次上线时间 
 * @property {ObjectId} extra - 出厂数据id 
 * @property {Object.<string, any>} settings - 设备设置 
 * @property {Object.<string, any>} params - 设备状态
 * @property {Object.<string, any>} tags - 设备标签 
 * @property {any[]} shareUsers - 旧设备分享信息，4.x.x开始使用 ShareUsersInfo
 * @property {ShareUserInfo[]} shareUsersInfo - 新设备分享信息，单个信息描述设备在接收分享方的信息
 * @property {Object} family - 家庭信息  
 * @property {ObjectId} family.id - 家庭id
 * @property {number} family.index - 设备在家庭的序号
 * @property {Object} [family.room] - 设备所在房间信息
 * @property {ObjectId} family.room.id - 房间id 
 * @property {string[]} family.members - 家庭成员apikey
 * @property {Object.<string, any>[]} relational - 设备关联信息
 * @property {string} [matterFabricId] - matter hub或设备的fabricId
 * @property {string} [matterNodeId] - matter hub或设备的matter nodeId
 * @property {string} [subscribeMatterHubId] - 将matter设备状态上报到云端的hub设备id
 * @property {Date} createdAt - 创建时间
 */

/**
 * 获取多台设备数据
 * @param {string[]} deviceIds - deviceid数组
 * @returns {Promise<DeviceInfo[]>}
 */
async function getDevicesByDeviceIds(deviceIds) {
    return dbModel.find({ deviceid: { $in: deviceIds } }).lean();
}

/**
 * 通过apikeys获取多台设备数据
 * @param {string[]} deviceIds - deviceid数组
 * @returns {Promise<DeviceInfo[]>}
 */
async function getDevicesByApikeys(apikeys) {
    return dbModel.find({ apikey: { $in: apikeys } }).lean();
}

/**
 * 获取家庭内家庭主人的设备
 * @param {string} familyOwnerApikey - 家庭主人apikey
 * @param {string|ObjectId} familyId - 家庭id
 * @returns {Promise<DeviceInfo[]>}
 */
async function getOwnerDevicesWithinFamily(familyOwnerApikey, familyId) {
    if (!(familyId instanceof ObjectId)) familyId = new ObjectId(familyId);
    return dbModel.find({ apikey: familyOwnerApikey, 'family.id': familyId }).lean();
}

/**
 * 更新家庭内家庭主人的设备
 * @param {string} familyOwnerApikey - 家庭主人apikey
 * @param {string|ObjectId} familyId - 家庭id
 * @param {object} update - 更新内容
 * @returns
 */
async function updateOwnerDevicesWithinFamily(familyOwnerApikey, familyId, update) {
    if (!(familyId instanceof ObjectId)) familyId = new ObjectId(familyId);
    const resultArr = await dbModel.find({ apikey: familyOwnerApikey, 'family.id': familyId }, { deviceid: 1 }).lean();
    await dbModel.updateMany({ apikey: familyOwnerApikey, 'family.id': familyId }, update);
    for (const item of resultArr) {
        await cacheInstance.delete(item.deviceid);
    }
}

/**
 * 获取分享到家庭的设备
 * @param {string} familyOwnerApikey - 家庭主人apikey
 * @param {string|ObjectId} familyId - 家庭id
 * @returns {Promise<DeviceInfo[]>}
 */
async function getShareDevicesWithinFamily(familyOwnerApikey, familyId) {
    if (!(familyId instanceof ObjectId)) familyId = new ObjectId(familyId);
    return dbModel.find({ 'shareUsersInfo.apikey': familyOwnerApikey, 'shareUsersInfo.family.id': familyId }).lean();
}

/**
 * 获取房间内房间主人的设备
 * @param {string} roomOwnerApikey - 房间主人apikey
 * @param {string|ObjectId} roomId - 房间id
 * @returns {Promise<DeviceInfo[]>}
 */
async function getOwnerDevicesWithinRoom(roomOwnerApikey, roomId) {
    if (!(roomId instanceof ObjectId)) roomId = new ObjectId(roomId);
    return dbModel.find({ apikey: roomOwnerApikey, 'family.room.id': roomId }).lean();
}

/**
 * 获取分享到房间的设备
 * @param {string} roomOwnerApikey - 房间主人apikey
 * @param {string|ObjectId} roomId - 房间id
 * @returns {Promise<DeviceInfo[]>}
 */
async function getShareDevicesWithinRoom(roomOwnerApikey, roomId) {
    if (!(roomId instanceof ObjectId)) roomId = new ObjectId(roomId);
    return dbModel.find({ 'shareUsersInfo.apikey': roomOwnerApikey, 'shareUsersInfo.family.room.id': roomId }).lean();
}

/**
 * 获取被指定设备所关联的所有设备
 * @param {string} deviceid 
 * @returns {Promise<DeviceInfo[]>}
 */
async function findRelatedDevicesByDeviceid(deviceid) {
    //从数据库中查找数据
    const deviceArray = await dbModel.find({ relational: { $elemMatch: { deviceid } } }).lean();
    if (deviceArray) {
        //设置缓存
        for (const device of deviceArray) {
            await cacheInstance.set(device.deviceid, JSON.stringify(device));
        }
    }
    return deviceArray;
}

/**
 * 获取自己的设备
 * @param {string} apikey 
 * @returns {Promise<DeviceInfo[]>}
 */
async function getOwnDevices(apikey) {
    const dbResult = await dbModel.find({ apikey }).lean();
    if (dbResult) {
        for (const item of dbResult) {
            //设置缓存
            await cacheInstance.set(item.deviceid, JSON.stringify(item));
        }
    }
    return dbResult;
}

/**
 * 获取通过3.x版本App分享给自己的设备
 * @param {string} apikey - 接收分享的用户apikey
 * @returns {Promise<DeviceInfo[]>}
 */
async function getV1ShareDevices(apikey) {
    const dbResult = await dbModel.find({ $or: [{ 'shareUsers.apikey': apikey }, { 'shareUsers': apikey }] }).lean();
    if (dbResult) {
        for (const item of dbResult) {
            //设置缓存
            await cacheInstance.set(item.deviceid, JSON.stringify(item));
        }
    }
    return dbResult;
}

/**
 * 更新指定设备的数据
 * @param {string} deviceid 
 * @param {Object.<string, any>} update 
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateByDeviceid(deviceid, update) {
    const deviceInfo = await dbModel.findOneAndUpdate({ deviceid }, update, { new: true }).lean();
    if (deviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(deviceInfo));
    } else {
        logger.warn('failed to update device to mongodb', 'deviceDao');
    }
    return deviceInfo;
}

/**
 * 更新指定批量设备的数据
 * @param {string[]} deviceids 
 * @param {Object.<string, any>} update 
 */
async function updateManyByDeviceid(deviceids, update) {
    await dbModel.updateMany({ deviceid: { $in: deviceids } }, update);
    const deviceInfos = await dbModel.find({ deviceid: { $in: deviceids } }).lean();
    for (const deviceInfo of deviceInfos) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceInfo.deviceid, JSON.stringify(deviceInfo));
    }
}

/**
 * 更新指定设备和分享人的分享数据
 * @param {string} deviceid 
 * @param {string} apikey - 接收分享的用户apikey 
 * @param {ShareUserInfo} shareUserInfo - 接收分享的用户的全量分享信息
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateV2ShareUserInfo(deviceid, apikey, shareUserInfo) {
    const deviceInfo = await dbModel.findOneAndUpdate({ deviceid, 'shareUsersInfo.apikey': apikey }, { 'shareUsersInfo.$': shareUserInfo }, { new: true }).lean();
    if (deviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(deviceInfo));
    } else {
        logger.warn('failed to update device to mongodb', 'deviceDao');
    }
    return deviceInfo;
}

/**
 * 向指定设备添加分享人信息
 * @param {string} deviceid 
 * @param {ShareUserInfo} shareUserInfo
 * @returns {Promise<DeviceInfo|null>}
 */
async function insertV2ShareUserInfo(deviceid, shareUserInfo) {
    const deviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $push: { shareUsersInfo: shareUserInfo } }, { new: true }).lean();
    if (deviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(deviceInfo));
    } else {
        logger.warn('failed to update device to mongodb', 'deviceDao');
    }
    return deviceInfo;
}

/**
 * 获取某人名下某个群组内的所有设备
 * @param {string} groupId 
 * @param {string} apikey 
 * @returns {Promise<DeviceInfo[]>}
 */
async function findDevicesInGroup(groupId, apikey) {
    const devices = await dbModel.find({
        $or: [{ 'apikey': apikey }, { 'shareUsersInfo.apikey': apikey }],
        'devGroups.groupId': groupId,
    }).lean();

    return devices;
}

/**
 * 根据deviceid全量更新对应设备的relational字段
 * @param {string} deviceid
 * @param {string} relational 更新后的relational字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateRelationalByDeviceid(deviceid, relational) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { relational } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device relational to mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid全量更新对应设备的settings字段
 * @param {string} deviceid
 * @param {string} settings 更新后的settings字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateSettingsByDeviceid(deviceid, settings) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { settings } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device settings to mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid全量更新对应设备的family字段
 * @param {string} deviceid
 * @param {string} newFamily 更新后的family字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateFamilyByDeviceid(deviceid, newFamily) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { family: newFamily } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device family to mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid全量更新对应设备的params.subDevices字段
 * @param {string} deviceid
 * @param {string} newSubDevices 更新后的params.subDevices字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateSubDevicesByDeviceid(deviceid, newSubDevices) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { 'params.subDevices': newSubDevices } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device params.subDevices to mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid更新对应设备的name字段
 * @param {string} deviceid
 * @param {string} newName 更新后的name字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateNameByDeviceid(deviceid, newName) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { name: newName } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device name mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid更新对应设备的params字段
 * @param {string} deviceid
 * @param {string} newParams 更新后的params字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateParamsByDeviceid(deviceid, newParams) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { params: newParams } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device params mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 根据deviceid更新对应设备的params字段
 * @param {string} deviceid
 * @param {string} newTags 更新后的params字段
 * @returns {Promise<DeviceInfo|null>}
 */
async function updateTagsByDeviceid(deviceid, newTags) {
    const newDeviceInfo = await dbModel.findOneAndUpdate({ deviceid }, { $set: { tags: newTags } }, { new: true }).lean();
    if (newDeviceInfo) {
        //更新成功，设置缓存
        await cacheInstance.set(deviceid, JSON.stringify(newDeviceInfo));
    } else {
        logger.warn('failed to update device tags mongodb', 'deviceDao');
    }
    return newDeviceInfo;
}

/**
 * 通过deviceid批量查询设备数据
 * @param {string[]} deviceIds
 * @param {{[fieldName: string]: 1|0}} [projection]
 * @returns {Promise<DeviceInfo[]>}
 */
function findManyByDeviceId(deviceIds, projection) {
    const findParams = [{ deviceid: { $in: deviceIds } }];
    if (projection) findParams.push(projection);
    return dbModel.find(...findParams).lean();
}

/**
 * 查找指定用户名下是否有设备为指定父设备的设备
 * @param {string} apikey
 * @param {string} parentId
 * @returns {Promise<DeviceInfo>}
 */
function findByApikeyAndParentId(apikey, parentId) {
    return dbModel.findOne({ apikey, 'params.parentid': parentId }).lean();
}

module.exports = {
    add,
    find,
    findMany,
    findByCondition,
    findByRelation,
    findSubDevices,
    findByConditionWithProjection,
    update,
    updateMany,
    remove,
    removeRelations,

    //以下是实施 DevOps 以来增加的新方法
    getDevicesByDeviceIds,
    getDevicesByApikeys,
    getOwnerDevicesWithinFamily,
    updateOwnerDevicesWithinFamily,
    getShareDevicesWithinFamily,
    getOwnerDevicesWithinRoom,
    getShareDevicesWithinRoom,
    findRelatedDevicesByDeviceid,
    findManyByDeviceId,
    getOwnDevices,
    getV1ShareDevices,
    updateByDeviceid,
    updateManyByDeviceid,
    updateV2ShareUserInfo,
    insertV2ShareUserInfo,
    findDevicesInGroup,
    updateRelationalByDeviceid,
    updateSettingsByDeviceid,
    updateFamilyByDeviceid,
    updateSubDevicesByDeviceid,
    updateNameByDeviceid,
    updateParamsByDeviceid,
    updateTagsByDeviceid,
    findByApikeyAndParentId,
};
