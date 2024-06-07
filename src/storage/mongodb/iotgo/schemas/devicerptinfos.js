const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'devicerptinfos';
const schema = new Schema({
    type: { type: String, required: true, index: true },  //0：网络测试结果1：异常上报信息
    deviceid: { type: String, required: true, index: true },  //设备id
    apikey: { type: String, required: true },  //用户id
    rptInfo: { type: Schema.Types.Mixed, default: {}, required: true },  //json格式的上报信息
    sequence: { type: String, required: true, index: true },  //上报的序列号，方便定位日志
    rptTime: { type: Date, required: true, index: true },  //上报时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
