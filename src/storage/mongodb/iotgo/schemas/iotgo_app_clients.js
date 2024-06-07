const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'iotgo_app_clients';
const schema = new Schema({
    number: { type: Number, required: true },
    appKey: { type: String, required: true },
    appSecret: { type: String },
    activateSecret: { type: String },
    desc: { type: String },
    valid: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    activatedAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
