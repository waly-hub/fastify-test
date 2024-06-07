/**
 * 信令通道表
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'kvs_signaling_channels';
const schema = new Schema({
    name: { type: String },         // 信令通道名
    arn: { type: String },          // 信令通道的aws资源定位符
    region: { type: String },       // 所属区域
    deviceid: { type: String },     // 占用该信令通道分配的设备的devicied
    credential: {                   // sts凭证
        key: { type: String },
        secret: { type: String },
        token: { type: String },
        expire: { type: Date },
    },
    startAt: { type: Date },        // 设备开始使用信令通道的时间
    expiredAt: { type: Date },      // 设备被允许使用信令通道的截止时间
    renewalAt: { type: Date },      // 设备最后一次对信令通道续期的时间
    renewalCount: { type: Number }, // 续期次数
    createdAt: { type: Date },       // 信令通道创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};