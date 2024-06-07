/**
 * 产品型号与厂商 PID 维护表
 * 用来维护产品型号关联的厂商 Matter 产品信息，维护完成后才生成 Matter 生产数据，然后烧录到模组。
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'matter_mappings';
const schema = new Schema({
    modelId: { type: mongoose.Types.ObjectId, required: true }, // modelinfos表的_id
    orignialVid: { type: String, required: true }, // 源厂商id，与matter_base_infos表的vid一致
    orignialPid: { type: String, required: true }, // 源产品id，与matter_base_infos表的pid一致
    vendorId: { type: String, required: true },  // 厂商id 
    productId: { type: String, required: true },  // 产品id
    vendorName: { type: String, required: true },   // 厂商名称
    productName: { type: String, required: true },  // 产品名称
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
