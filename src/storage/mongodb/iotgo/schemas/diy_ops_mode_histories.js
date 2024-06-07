/**
 * 设备diy模式切换统计表
 * 索引由老丁创建，不在schema中写
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'diy_ops_mode_histories';
const schema = new Schema({
    deviceid: { type: String },
    opsCount: { type: Number },
    lastOpsAt: { type: Date },
    createdAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
