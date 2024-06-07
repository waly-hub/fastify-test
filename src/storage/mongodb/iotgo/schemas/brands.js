
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'brands';
const schema = new Schema({
    name: { type: String, index: true, required: true },  //名称
    name_en: { type: String, index: true }, //英文名称
    showBrand: { type: Boolean },
    desc: { type: String },  //描述
    apps: [String],//应用appid数组
    appSecrets: [String],  //users表中的apikey数组
    appTypes: [String],
    appEnables: [String],  //0有效  1无效
    appRoles: [String],
    sourceId: { type: String },  //审核后的数据Id
    logoUrl: { type: String }, //品牌表对应的logo url
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};