const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'mpsubscribes';
const schema = new Schema({
    openid: { type: String, required: true, index: true },//公众号openid
    unionid: { type: String, index: true },//unionid
    // subscribeType: { type: Number, required: true, index: true, default: 1 },// 状态 1关注 2取关
    subscribeAt: { type: Date, required: true, index: true },// 关注时间
    // unSubscriberAt: { type: Date, index: true },//取关时间
    // officialAccount: { type: Schema.Types.Mixed, default: {}, required: true }//用户信息
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

