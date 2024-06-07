/**
 * 存储用户的三方账号信息
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_extra_accounts';
const schema = new Schema({
    clientId: { type: String, required: true }, // 三方客户端id
    apikey: { type: String }, // 用户apikey
    uniqueId: { type: String, required: true }, // 三方账号唯一标识
    infos: { type: Object, default: {} }, // 三方账号信息，例如昵称、头像、邮箱等。
    createdAt: { type: Date, default: Date.now },
    isAlive: { type: Boolean, required: true }, // 仅当用户注销apikey无效时做删表操作，其它时候做逻辑删除。
});

module.exports = {
    name: collectionName,
    schema: schema,
};