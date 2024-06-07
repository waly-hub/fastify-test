const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'dem_devices';
const schema = new Schema({
    recordId: { type: Schema.Types.ObjectId },          // 设备记录的objectId
    uiid: { type: Number },                             // 设备的uiid
    nextFetchTime: { type: Date },                      // 下一次获取该设备能耗数据的时间戳
    createTime: { type: Date },
    updatedTime: { type: Number },                         // 更新时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
