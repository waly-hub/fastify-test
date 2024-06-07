const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'appid_configs';
const schema = new Schema({
    appid: { type: String, index: true, required: true },
    appSecret: { type: String },
    appEnables: { type: Number },
    appRoles: { type: String },
    appDesc: { type: String },
    app_name: { type: String, required: true },
    app_name_en: { type: String, required: true },
    sms_sid: { type: String },
    sms_token: { type: String },
    sms_appid: { type: String },
    sms_templateid: { type: String },
    email_host: { type: String },
    email_port: { type: String },
    email_user: { type: String },
    email_pass: { type: String },
    email_secure: { type: String },
    email_from: { type: String },
    twilioSid: { type: String },
    twilioToken: { type: String },
    twilioFromNumber: { type: String },
    umengUrl: { type: String },
    umengKey_Android: { type: String },
    umengSecret_Android: { type: String },
    umengKey_Ios: { type: String },
    umengSecret_Ios: { type: String },
    emailFeedbackAddress: { type: String },
    isAll: { type: Number },  // 0表示是   1表示不是 是否拥有超级权限，控制所有品牌
    brands: [{ type: Schema.Types.ObjectId }],  //可控制的品牌列表
    manuId: { type: Schema.Types.ObjectId, index: true },  //所属厂商
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date }, //过期时间,
    emailType: { type: Number },// 邮件类型
    mengwangSms: {//梦网短信
        baseUrl: { type: String },
        baseUser: { type: String },
        basePwd: { type: String },
        moduleId: { type: String },
        svrtype: { type: String },
    },
    extraPush: [Schema.Types.Mixed],
    qrCodeSettings: { type: Object },
    uns: { type: String },//全称usernamespace，用于用户体系隔离
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};