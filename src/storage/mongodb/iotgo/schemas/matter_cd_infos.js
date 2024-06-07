/**
 * 固件版本与 CD 文件映射表
 * 用来维护固件版本对应的厂商 CD 文件，维护完成后，才可在生产环节调用获取 CD 文件接口，查询对应的 CD 文件并返回。
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'matter_cd_infos';
const schema = new Schema({
    modelId: { type: mongoose.Types.ObjectId, required: true }, // modelinfos表的_id
    matVersion: { type: String, required: true },   // matter固件版本
    s3Path: { type: String, required: true },   // cd文件存放路径
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
