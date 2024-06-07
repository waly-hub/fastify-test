const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_removes';
const schema = new Schema({
    apikey: { type: String, required: true, index: true },
    account: { type: String, required: true, index: true },
    createdAt: { type: Date, index: true, default: Date.now },
    sidArr: { type: Array, default: [] },
    deviceArr: { type: Array, default: [] },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};