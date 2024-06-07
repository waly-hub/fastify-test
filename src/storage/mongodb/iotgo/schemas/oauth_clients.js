const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const collectionName = 'oauth_clients';
const schema = new Schema({
    clientId: { type: String, required: true, unique: true, index: true, default: uuid.v4 },
    clientSecret: { type: String, required: true, default: uuid.v4 },
    redirectURL: { type: String },
    name: { type: String, required: true },
    desc: { type: String },
    pkgName: { type: String }, // ios ?
    enable: { type: String, required: true },  //配置是否生效  0有效 1无效
    role: { type: String },//个人开发者角色   //测试开发者角色   //客户角色
    basicInvokeQuota: { type: Number }, //基础配额
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
