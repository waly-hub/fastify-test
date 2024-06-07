const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'models';
const schema = new Schema({
    model: { type: String, index: true },
    ui: [{ type: String }],
    devConfig: {
        tcReqPeriod: { type: Number },
        tcReqMax: { type: Number },
    },
    enableDiffUpgrade: { type: Boolean, default: false },
    pairMode: { type: Number },
    ethernet: { type: Boolean },
    protocolVersion: { type: Number }, // 酷宅协议版本，当值为3代表该固件使用的配网协议为酷宅配网3.0。表内无该字段则默认为旧版方案。
    otaSystemV2: { // 新版ota系统配置项，固件维度配置项（注意同样的还有产品型号维度的配置项，在modelinfos表内）
        fwVersionRequire: { type: String }, // 使用新版ota系统要求的最小的设备当前版本。小于该版本的设备，走旧系统去下载ota包。
        otaDimension: { type: String }, // 默认是model维度ota，若该字段值为productModel，则是按产品型号维度创建固件版本和发布ota版本
        strongRemind: { // 固件维度的强提醒开关
            enable: { type: Number }, // 0 关闭、1 开启
        },
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};