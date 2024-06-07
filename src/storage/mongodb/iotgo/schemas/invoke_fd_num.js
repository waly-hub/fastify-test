const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'invoke_fd_num';
const schema = new Schema({
    apikey: { type: String },
    num: { type: Number },
    laserNum: { type: Number },
    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
