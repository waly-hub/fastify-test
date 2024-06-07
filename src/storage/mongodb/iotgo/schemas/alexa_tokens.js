const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'alexa_tokens';
const schema = new Schema({
    uid: { type: String, required: true }, // 用户apikey
    client_id: { type: String },  // 第三方平台标识
    access_token: { type: String }, // 同第三方平台通信所需token
    refresh_token: { type: String }, // 第三方平台刷新token
    token_type: { type: String }, // token 类型
    google_custom_token: { type: String }, // 用途未知？
    expires_in: { type: Number }, // 过期时间
    miot_subscription_info: { type: Schema.Types.Mixed }, // 米家订阅消息信息
    alexa_region: { type: String }, // Alexa用户所在区域, US,EU,FE
    alexa_userid: { type: String }, // Alexa用户id
    oauth_token_callback: { type: String }, // 向第三方平台获取token和刷新token的URL（SmartThings）
    state_report_callback: { type: String }, // 设备状态上报给第三方平台的URL（SmartThings）
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

