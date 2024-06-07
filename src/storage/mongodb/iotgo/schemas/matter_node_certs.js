/**
 * 维护fabric网络下matter noc证书的生成记录
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'matter_node_certs';
const schema = new Schema({
    matterFabricId: { type: String, required: true },
    matterNodeId: { type: String, required: true },
    matterCat: { type: String }, // 给设备证书生成cat标签，8位16进制字符。app端证书和hub端证书该字段必传
    certType: { type: String }, // 证书类型
    deviceId: { type: String }, // 当 certType 为 HUB 或 DEVICE 时，该字段表示设备的 deviceid。
}, {
    collection: collectionName,
    timestamps: true,
});

module.exports = {
    name: collectionName,
    schema: schema,
};