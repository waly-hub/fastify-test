const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'users_ifttt_triggers';
const schema = new Schema({
    apikey: { type: String, required: true }, // trigger所属的apikey
    trigger_slug: { type: String, required: true }, // ifttt触发器名称
    trigger_identity: { type: String, required: true}, // ifttt触发器唯一标识
    triggerFields: { type: Schema.Types.Mixed }, // 触发器触发字段的取值条件
    condition: { type: Schema.Types.Mixed }, // 触发器的触发条件，用于判断触发器是否满足触发条件
    conditionMemberCompareExps: { type: Schema.Types.Mixed }, // 判断触发器是否可被触发，在本条件判断通过的前提下
    deviceid: { type: String, required: true }, // 作为触发条件的设备id
    updateAt: { type: Date, required: true }, // 数据表最新一次更新的时间
    response: { type: Schema.Types.Mixed }, // 历史触发信息，最长可保存50条
    ifttt_service_key: { type: String }, // ifttt的应用密钥
    website: { type: String }, // ifttt应用的官方网站
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};