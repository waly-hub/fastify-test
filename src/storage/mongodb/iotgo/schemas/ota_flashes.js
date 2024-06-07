const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'ota_flashes';
const schema = new Schema({
    deviceid: { type: String, required: true, index: true, unique: true, match: /^[0-9a-f]{10}$/ },
    apikey: { type: String, required: true, index: true },
    sequence: { type: String },
    remoteIp: { type: String },
    rootRestore: { type: Boolean }, // 恢复脱保标记 2023-11-28 慢慢提出的加急需求 允许恢复脱保状态 但是需要保留记录
    rootRestoreTime: { type: Date }, // 恢复脱保时间
}, { collection: collectionName, timestamps: true });

module.exports = {
    name: collectionName,
    schema: schema,
};

