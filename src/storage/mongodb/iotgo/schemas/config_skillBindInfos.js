const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'config_skillBindInfos';
const schema = new Schema({
    appid: { type: String },
    platform: { type: String }, // 语音平台
    index: { type: Number }, // 排序用，相同platform和appid的记录，根据index排序使用。
    info: { type: Schema.Types.Mixed, default: {} }, // 平台技能信息
    createAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

