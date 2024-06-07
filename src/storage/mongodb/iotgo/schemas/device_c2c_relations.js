const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_c2c_relations'; // 存储设备云对云的关联关系
const schema = new Schema({
    deviceid: { type: String, required: true }, // 设备id
    apikey: { type: String, required: true }, // 用户apikey
    clientid: { type: String, required: true },  // 第三方平台应用标识
    relation: { type: Number, required: true, default: 0 }, // 关联状态
    updatedAt: { type: Date }, // 最后更新时间
    createdAt: { type: Date, required: true, default: Date.now }, // 创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

