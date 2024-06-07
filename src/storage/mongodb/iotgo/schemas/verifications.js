const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'verifications';
const schema = new Schema({
    phoneNumber: { type: String, required: true },
    uns: { type: String },
    verificationCode: { type: String },
    verificationCodeType: { type: Number },
    expand_verificationCode: { type: String },
    expiredAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};