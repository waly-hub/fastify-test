const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'devicetmpregs';
const schema = new Schema({
    deviceid: { type: String, required: true, index: true },  //0：网络测试结果1：异常上报信息
    conn_region: { type: String },  //设备临时连接的区域
    added_region: { type: String },  //设备正式配对的区域
    connAt: { type: Date },  //设备id
    addedAt: { type: Date },  //设备id
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
