const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'member_charge';
const schema = new Schema({
    apikey: { type: String },//用户apikey
    oldMemberInfo: {
        level: { type: Number },
        validAt: { type: Date },
        expiredAt: { type: Date },
    },
    newMemberInfo: {
        level: { type: Number },
        validAt: { type: Date },
        expiredAt: { type: Date },
    },
    orderId: { type: String },       // 充值的订单号
    createdAt: { type: Date, default: Date.now },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
