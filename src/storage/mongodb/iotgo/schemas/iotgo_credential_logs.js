const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'iotgo_credential_logs';
const schema = new Schema({
    itCredential: { type: String, required: true },
    dataType: { type: String, required: true },
    appkey: { type: String },
    name: { type: String },
    model: { type: String },
    number: { type: Number },
    downloadedAt: { type: Date },
    isDownloaded: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    // isGenerated: { type: Boolean },
    generatedAt: { type: Date },
    generatedStatus: {type: String},
    start: {type: Number},
    end: {type: Number},
    current: {type: Number},
    productId: {type: mongoose.Types.ObjectId, required: true},
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
