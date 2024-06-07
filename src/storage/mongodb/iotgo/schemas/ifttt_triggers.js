const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'ifttt_triggers';
const schema = new Schema({
    trigger_slug: { type: String, required: true }, // ifttt触发器名称
    triggerFields: { type: Schema.Types.Mixed }, // ifttt触发器可作为条件的字段列表
    ingredients: { type: Schema.Types.Mixed }, // ifttt触发器成分，自定义字段。
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};