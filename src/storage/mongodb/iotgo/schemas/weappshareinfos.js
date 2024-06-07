const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'weappshareinfos';
const schema = new Schema({
    apikey: { type: String },       //创建卡片时设备主人的apikey
    deviceid: [String],             //分享的deviceid列表
    familyid: { type: String },     //分享的家庭id
    sequence: { type: Date, default: Date.now },     //创建卡片的时间的时间
    shareNum: { type: Number },     //初始可分享人数
    surplus: { type: Number },      //当前可分享人数
    prescription: { type: Number }, //卡片有效时间（单位：小时）
    permit: { type: Number },       //分享权限
    platform: { type: String },     //分享平台
    type: { type: String },         //分享类型，share/clone
    deviceList: [new Schema({
        deviceid: { type: String },
        expiredAt: { type: Date },
        authority: {
            updateTimers: { type: Boolean },
        },
    })],
    expiredAt: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
