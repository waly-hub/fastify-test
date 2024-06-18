const storage = require('../../../utils/storage_service').get();
const modelsModel = storage.mongodb.iotgo.getCollection('models');

//固件表

/**
 * 通过固件名称查询固件信息
 * @param {String} name - 固件名，对应 iotgo 的 models 表的 model 字段
 */
async function getModelByName(name) {
    return await modelsModel.findOne({ model: name }).lean();
}

module.exports = {
    getModelByName,
};