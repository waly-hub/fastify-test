const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'p2p_bindings';
const schema = new Schema({
    provider: { type: Number, required: true },
    deviceid: { type: String, index: true },
    p2pinfo: { type: Schema.Types.Mixed, default: {} },
    bindingTime: { type: Date },
    productModel: { type: Schema.Types.ObjectId },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

