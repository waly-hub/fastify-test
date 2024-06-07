const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'thirdparty_oauth_tokens';
const schema = new Schema({
    apikey: { type: String, required: true }, // 用户apikey
    client_id: { type: String, required: true },  // 第三方平台标识
    access_token: { type: String, required: true }, // 同第三方平台通信所需token
    refresh_token: { type: String }, // 第三方平台刷新token
    token_type: { type: String }, // token 类型
    thirdparty_uid: { type: String, required: true }, // 用户在第三方平台的账号id，若第三方未提供该信息则填写apikey的值
    refresh_time: { type: Date, required: true }, // 刷新token的时间，插入新记录时根据过期时间计算。若无过期时间则该值为【now+1000年】
    extend_data: { type: Object }, // 保留字段
    created_at: { type: Date, required: true, default: Date.now }, // 创建时间
    is_delete: { type: Number }, // 标记是否逻辑删除，1删除，0未删除
    last_update_time: { type: Date }, // 最后更新时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};