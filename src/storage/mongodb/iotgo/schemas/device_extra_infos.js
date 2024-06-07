const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_extra_infos';

//设备的某个属性不只由设备决定，受根据当前用户/客户端影响，就记录在该表中
const schema = new Schema({
    _id: { type: String },// 主键,格式为deviceid_apikey
    deviceid: { type: String },//设备ID,冗余
    apikey: { type: String },// 用户apikey,格式为deviceid_apikey
    clientId: { type: String },// 客户端ID,即appid
    tags: { type: Object, default: {} }, //设备的tags字段，会与devices中的tags进行merge
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};