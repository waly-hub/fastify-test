/**
 * alexa-app2app流程用户的账户关联token信息表
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'alexaAccountLinkingTokens';
const schema = new Schema({
    apikey: { type: String }, // 用户apikey
    alexa_clientid: { type: String }, // alexa skill 的clientid，注意是alexa下发的技能clientid
    access_token: { type: String }, // 用户at
    expires_in: { type: Number }, // at过期时间
    refresh_token: { type: String },// 用户rt
    token_type: { type: String }, // token类型
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};