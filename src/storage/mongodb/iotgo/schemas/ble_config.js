const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'ble_config';
const schema = new Schema({
    ptotocal: { type: String }, //协议代号
    allowList: [{ type: Object }],//允许通过该协议添加的产品型号及uiid名单
    name: { type: String }, //协议名称
    createdAt: { type: Date },  //创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};