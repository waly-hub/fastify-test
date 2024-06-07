const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collectionName = 'shares';
const schema = new Schema({
    apikey: {type: String, required: true, index:true},  //用户apikey
    deviceid: {type: String, required: true, index:true},  //设备id
    sequence: {type: String, required: true},  //请求时间
    uid: {type: String, required: true},  //接收方的手机号
    deviceName: {type: String, required: true},  //设备的名称
    userName: {type: String},  //用户的昵称，可以为空
    share_time: {type: Date,required:true},  //服务器接收到分享消息的时间
    result: {type: Number,required:true}, //0 等待对方确认 1 用户接受分享 2 用户不接受分享 3 操作超时
}, {collection: collectionName});

module.exports = {
    name: collectionName,
    schema: schema,
};
