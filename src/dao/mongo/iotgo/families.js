const ObjectId = require('mongoose').Types.ObjectId;

const storage = require('../../../utils/storage_service').get();
const dbModel = storage.mongodb.iotgo.getCollection('families');

/**
 * @typedef FamilyShareUserInfo
 * @property {String} apikey
 * @property {String} comment
 * @property {Date} shareDate
 * @property {String} platform
 * @property {Date} [expiredAt]
 */

/**
 * @typedef FamilyInfo
 * @property {Object} _id
 * @property {String} apikey
 * @property {String} name
 * @property {Number} index
 * @property {object[]} rooms
 * @property {Object} rooms[]._id
 * @property {String} rooms[].name
 * @property {Number} rooms[].index
 * @property {FamilyShareUserInfo[]} shareUsersInfo
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {*} extList
 * @property {ObjectId} currentRhythmGroup
 */

/**
 * 获取用户自己的家庭数量
 * @param {String} apikey - 用户Apikey
 * @returns {Promise<Number>}
 */
async function getNumOfUserOwnFamily(apikey) {
    return dbModel.countDocuments({ apikey });
}

/**
 * 获取用户序号最小的家庭数据
 * @param {String} apikey - 用户Apikey 
 * @returns {Promise<FamilyInfo|null>}
 */
async function getUserMinSeqFamily(apikey) {
    const familyList = await dbModel.find({ apikey }).sort({ index: 1 }).limit(1).lean();
    return familyList[0] || null;
}

/**
 * 获取用户序号最大的家庭数据
 * @param {String} apikey - 用户Apikey 
 * @returns {Promise<FamilyInfo|null>}
 */
async function getUserMaxSeqFamily(apikey) {
    const familyList = await dbModel.find({ apikey }).sort({ index: -1 }).limit(1).lean();
    return familyList[0] || null;
}

/**
 * 获取用户名下所有的家庭，不包括分享家庭
 * @param {String} apikey - 用户 apikey
 * @returns {Promise<FamilyInfo[]>}
 */
async function getOwnFamilies(apikey) {
    return dbModel.find({ apikey }).lean();
}

/**
 * 获取分享给用户的家庭
 * @param {String} apikey - 用户 apikey
 * @returns {Promise<FamilyInfo[]>}
 */
async function getSharedFamilies(apikey) {
    return dbModel.find({
        'shareUsersInfo.apikey': apikey,
    }).lean();
}

/**
 * 通过用户的房间查询家庭信息
 * @param {String} apikey 
 * @param {String|ObjectId} roomId 
 * @returns {Promise<FamilyInfo|null>}
 */
async function getFamilyByApikeyAndRoomId(apikey, roomId) {
    return dbModel.findOne({ apikey, 'rooms._id': roomId instanceof ObjectId ? roomId : new ObjectId(roomId) }).lean();
}

/**
 * 通过家庭id获取家庭信息
 * @param {String} id 
 * @returns {Promise<FamilyInfo|null>}
 */
function getFamilyById(id) {
    return dbModel.findById(id).lean();
}

/**
 * 更新指定id的家庭，并返回更新后的文档
 * @param {String} id 
 * @param {object} update 
 * @returns {Promise<FamilyInfo|null>}
 */
async function updateFamilyById(id, update) {
    return dbModel.findByIdAndUpdate(id, update, { new: true }).lean();
}

/**
 * 更新房间信息
 * @param {String | ObjectId} familyId - 家庭id
 * @param {String | ObjectId} roomId - 房间id
 * @param {object} update - 更新内容
 * @returns {Promise<FamilyInfo|null>}
 */
async function updateRoomByFamilyIdAndRoomId(familyId, roomId, update) {
    const _familyId = familyId instanceof ObjectId ? familyId : new ObjectId(familyId);
    const _roomId = roomId instanceof ObjectId ? roomId : new ObjectId(roomId);
    return dbModel.findOneAndUpdate({ _id: _familyId, 'rooms._id': _roomId }, update, { new: true }).lean();
}

/**
 * 更新某个家庭成员的全量分享信息
 * @param {String | ObjectId} familyId - 家庭id
 * @param {String} apikey - 家庭成员apikey
 * @param {FamilyShareUserInfo} shareUserInfo - 该家庭成员的全量分享信息
 * @returns {Promise<FamilyInfo|null>}
 */
async function updateShareUserInfo(familyId, apikey, shareUserInfo) {
    if (!(familyId instanceof ObjectId)) familyId = new ObjectId(familyId);
    return dbModel.findOneAndUpdate({ _id: familyId, 'shareUsersInfo.apikey': apikey }, { 'shareUsersInfo.$': shareUserInfo }, { new: true }).lean();
}

/**
 * 插入某个家庭成员的全量分享信息
 * @param {String | ObjectId} familyId - 家庭id
 * @param {FamilyShareUserInfo} shareUserInfo - 该家庭成员的全量分享信息
 * @returns {Promise<FamilyInfo|null>}
 */
async function insertShareUserInfo(familyId, shareUserInfo) {
    return dbModel.findByIdAndUpdate(familyId, { $push: { shareUsersInfo: shareUserInfo } }, { new: true }).lean();
}

/**
 * 创建新的家庭
 * @param {object} familyInfo
 * @param {String} familyInfo.apikey - 用户apikey
 * @param {String} familyInfo.name - 家庭名称
 * @param {Number} familyInfo.index - 家庭序号
 * @param {object[]} familyInfo.rooms - 房间列表
 * @param {ObjectId} familyInfo.rooms._id - 房间_id
 * @param {String} familyInfo.rooms.name - 房间名称
 * @param {Number} familyInfo.rooms.index - 房间序号
 * @returns {Promise<FamilyInfo|null>}
 */
async function createFamily(familyInfo) {
    familyInfo.createdAt = new Date();
    familyInfo.updatedAt = new Date();
    return dbModel.create(familyInfo);
}

/**
 * 移除房间
 * @param {String|ObjectId} familyId - 家庭id
 * @param {String|ObjectId} roomId - 房间id
 * @returns {Promise<FamilyInfo|null>}
 */
async function deleteRoomByFamilyIdAndRoomId(familyId, roomId) {
    const _familyId = familyId instanceof ObjectId ? familyId : new ObjectId(familyId);
    const _roomId = roomId instanceof ObjectId ? roomId : new ObjectId(roomId);
    return dbModel.findOneAndUpdate({ _id: _familyId, 'rooms._id': _roomId }, { $pull: { 'rooms': { _id: _roomId } }, updatedAt: new Date() }, { new: true }).lean();
}

/**
 * 更新家庭的手表上的场景列表
 * @param {string|ObjectId} familyId - 家庭id
 * @param {string} watchType - 手表类型
 * @param {string} watchScenes - 场景列表
 * @returns {Promise<FamilyInfo|null>}
 */
async function updateWatchScenesByFamilyId(familyId, watchType, watchScenes) {
    const _familyId = familyId instanceof ObjectId ? familyId : new ObjectId(familyId);
    return await dbModel.updateOne({ _id: _familyId }, { $set: { [`extList.${watchType}.scenes`]: watchScenes, updatedAt: new Date() } }, { new: true });
}

module.exports = {
    getNumOfUserOwnFamily,
    getUserMinSeqFamily,
    getUserMaxSeqFamily,
    getOwnFamilies,
    getSharedFamilies,
    getFamilyById,
    getFamilyByApikeyAndRoomId,
    createFamily,
    updateFamilyById,
    updateRoomByFamilyIdAndRoomId,
    updateShareUserInfo,
    insertShareUserInfo,
    deleteRoomByFamilyIdAndRoomId,
    updateWatchScenesByFamilyId,
};