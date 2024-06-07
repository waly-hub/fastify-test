const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'gsm_infos';
const schema = new Schema({
    accessNum: { type: Number, index: true, required: true },// 接入号
    iccid: { type: String, index: true, required: true },// iccid
    tradeMark: { type: Number, index: true, required: true },// 自定义的商标号
    isPool: { type: Number, default: 0 }, // 是否加入流量池
    isSend: { ype: Number, default: 0 }, // 0 没有发送过 1 发送过
    status: { type: String, index: true },
    statusMsg: { type: Schema.Types.Mixed, default: {} },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};