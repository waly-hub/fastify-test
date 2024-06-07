const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'reserved_deviceid';
const schema = new Schema({
    deviceid: { type: String },
    uiid: { type: Number },
    protocol: { type: String },
    modelInfo: { type: Schema.Types.ObjectId },
    createdAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

