const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'factorydevices';
const schema = new Schema({
    deviceid: { type: String, required: true, index: { unique: true }, match: /^[0-9a-f]{10}$/ },
    apikey: { type: String, required: true, index: true },
    createdAt: { type: Date, index: true, default: Date.now },//生成时间
    expiredAt: { type: Date },//失效时间
    gsmId: { type: String },
    devices: { type: Object },
    extra: {
        ui: { type: String, required: true }, //UI选项[下拉菜单选择：单通道插座 双通道插座 三通道插座 四通道插座 单通道开关 双通道开关 三通道开关 单通道LED灯泡]
        uiid: { type: Number },
        mac: { type: String, required: true }, //MAC
        apmac: { type: String, required: true }, //MAC
        model: { type: String, required: true }, //模块型号
        description: { type: String },
        modelInfo: { type: Schema.Types.ObjectId },  //关联至model_info表
        manufacturer: { type: String, required: true }, //产品厂家
        brandId: { type: Schema.Types.ObjectId },
        devConfig: {
            p2pServerName: { type: String },
            p2pAccout: { type: String },
            p2pLicense: { type: String },
        },
        chipid: { type: String },
        itCredential: { type: String },    // 生产凭证
    },
    partnerDevice: {
        ezVedioSerial: { type: String, index: true },
        partnerInfo: { type: Schema.Types.Mixed },
        thirdPartyInfo: { type: String },
    },
    nestDevice: {
        accessToken: { type: String },
        nestDeviceid: { type: String, index: true },
    },
    country: { type: String },
    name: { type: String },
    qrCodeId: { type: String },
    qrCode: { type: String },
    secretKey: { type: String },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};


