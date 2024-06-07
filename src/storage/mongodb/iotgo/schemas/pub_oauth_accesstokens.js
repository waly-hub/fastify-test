const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'pub_oauth_accesstokens';
const schema = new Schema({
    apikey: { type: String, required: true }, // 用户apikey
    code: { type: String }, // 授权码
    code_expiresAt: { type: Date }, // 授权码过期时间
    access_token: { type: String }, // 凭证
    access_token_expiresAt: { type: Date }, // 凭证过期时间
    refresh_token: { type: String }, // 刷新凭证
    refresh_token_old: { type: String },// ?
    clientid: { type: String }, // 客户端id
    region: { type: String }, // apikey所属用户所在的region
    alexa_region: { type: String }, // Alexa用户所在区域，US/EU/FE
    alexa_userid: { type: String }, // Alexa用户id
    anonymousId: { type: String }, // 匿名账号id，格式：[匿名账号来源]_[匿名账号标识]
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

