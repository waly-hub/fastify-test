/**
 * 设备基础信息
 * 维护VID和PID信息，防止申请 PID 时造成重复。
 * 同时该PID信息会关联到matter_mappings表，维护厂商 PID 时需要选择对应的酷宅 PID。
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'matter_base_infos';
const schema = new Schema({
    vid: { type: String, required: true }, // 厂商id，基本都是酷宅ID
    pid: { type: String, required: true }, // 产品id
    name: { type: String, required: true }, // 产品名称
    description: { type: String },  // 产品描述
    ean: { type: String, required: true }, // 认证69码
    chip: { type: String, required: true }, // 芯片
    fwModel: { type: String, required: true }, // 固件model
    familyId: { type: String, required: true }, // 家族认证id
    familyPid: { type: String },    // 申请家族认证的产品pid
    csaName: { type: String, required: true },  // CSA认证名称
    discoveryBit: { type: String, required: true }, // 发现能力
    flow: { type: String, required: true },   // 配对流程
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
