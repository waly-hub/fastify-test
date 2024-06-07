const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'casts';
const schema = new Schema({
    name: { type: String, required: true },
    apikey: { type: String, required: true },
    things: [{ type: String }],
    cameras: [{ type: String }],
    scenes: [{ type: String }],
    charts: [{ type: String }],
    pinCode: { type: String },
    index: { type: Number },
    subject: {
        calendar: { type: Boolean },
        weather: {
            cityId: { type: String },
            geo: { type: String },
            cityName: { type: String },
        },
    },
    setting: {
        backgroundColor: { type: String },
    },
    position: { type: Schema.Types.Mixed, default: {} }, // 磁贴位置信息，客户端透传，服务端不会读取或使用该数据
    cookie: { type: Schema.Types.Mixed, default: {} }, // 有关cast使用的自定义信息，客户端透传，服务端不会读取或使用该数据
}, { collection: collectionName, minimize: false });

module.exports = {
    name: collectionName,
    schema: schema,
};
