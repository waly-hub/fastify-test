const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'ifttt_actions';
const schema = new Schema({
    action_slug: { type: String, required: true }, // ifttt执行器名称
    actionFields: { type: Schema.Types.Mixed }, // ifttt执行器可作为条件的字段列表
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};