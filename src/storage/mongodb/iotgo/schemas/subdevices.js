const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'subdevices';
const schema = new Schema({
    parentDeviceId: { type: String, index: true, required: true },
    type: { type: String }, //子设备类型
    name: { type: String, index: true }, //子设备名称
    brand: { type: String },  //品牌
    model: { type: String },//型号
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
