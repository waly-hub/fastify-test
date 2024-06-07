const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'partner_account_links';
const schema = new Schema({
    type: { type: Number, required: true, index: true },   //厂商类型  1 nest  2 萤石
    apikey: { type: String, required: true, index: true },
    accessToken: { type: String, required: true, index: true },  //访问第三方接口的token
    puid: { type: String, required: true, index: true },  //第三方用户id
    updateTime: { type: Date, default: Date.now }, // 操作时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
