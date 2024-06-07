const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_records';
const schema = new Schema({
    recordId: { type: String },// 记录ID
    oldestRecordTime: { type: Date }, // 记录的时间
    createdAt: { type: Date }, // 该条数据的创建时间
    type: { type: String },// 区分设备、消息中心
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

