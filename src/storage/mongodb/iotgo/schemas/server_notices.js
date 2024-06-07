const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'server_notices';
const schema = new Schema({
    country: { type: String, index: true },
    title: { type: String, index: true },
    notice: { type: String, index: true },
    url: { type: String, index: true },
    from: { type: Number, index: true, default: 0 },//0 全部 1 app 2 小程序
    createAt: { type: Date, index: true, default: Date.now() },
    updateAt: { type: Date, index: true, default: Date.now() },
    startAt: { type: Date, index: true, default: Date.now() },
    endAt: { type: Date, index: true, default: Date.now() },
    isDisable: { type: Boolean, default: false },// 是否禁用
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};