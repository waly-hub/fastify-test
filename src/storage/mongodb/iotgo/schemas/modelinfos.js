const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'modelinfos';
const schema = new Schema({
    name: { type: String, required: true, index: true },  //名称，不允许重复
    name_en: { type: String, index: true },  //英文名称
    desc: { type: String },  //描述
    manuId: { type: Schema.Types.ObjectId },//所属厂商
    brandId: { type: Schema.Types.ObjectId },//所属品牌
    commType: { type: Number, index: true },//通信类型 1 WIFI;2 BLE/BT;3 2/3/4G
    catalog: { type: Number, index: true },//方便统计  1 家电;2 视频;3 健康;4 户外; 5 可穿戴
    model: { type: String },  //模块型号
    ui: { type: String },  //UI
    uiid: { type: Number },
    datapointConfig: [{
        name: { type: String },
        interval: { type: Number }, //以秒为单位的时间间隔
        nameCn: { type: String }, //中文名称，用在界面展示。将来支持不同的Locale。
    },
    ],
    sourceId: { type: String },  //0表示厂商管理系统审核后的数据
    sku_settings: { type: Object },  //产品型号SKU设置 订单管理系统新增
    devConfig: {
        storeAppid: { type: String }, //存储接口的appid
        storeAppsecret: { type: String }, //存储接口的secret
        bucketName: { type: String },//存储桶的名称
        callbackUrl: { type: String },  //视频上传成功后，回调的api接口地址
        callbackHost: { type: String }, //回调的服务器地址
        callbackBody: { type: String }, //回调时，传递给接口的参数包括哪些
        storetype: { type: Number },  //存储方案类型：0：aws 1:七牛
        captureNumber: { type: Number }, //每次抓图张数
        lengthOfVideo: { type: Number }, //视频存储长度，单位秒
        uploadLimit: { type: Number }, //视频或者图片上报的间隔限制，单位分钟。例如：设置为20。就是说就算画面一直在变化，那么最多也就是20分钟才抓一次视频，上传到服务器。
        statusReportUrl: { type: String },
    },
    deviceConfigToApp: { type: Object },    //设备专供app读取的配置字段
    supportQrCodeAdd: { type: Boolean, default: false }, //是否支持二维码添加
    pairMode: { type: Number }, //ap配网方式，默认1兼容配网   2 热点配网
    settings: {
        pushSettings: { type: Schema.Types.Mixed, default: {} },
        stateReportSettings: { type: Schema.Types.Mixed, default: {} },
        historySettings: { type: Schema.Types.Mixed, default: {} },
        pushContent: { type: Schema.Types.Mixed, default: {} },
    },
    otaSystemV2: { // 新版ota系统配置项，产品型号维度配置项（注意同样的还有固件维度的配置项，在models表内）
        strongRemind: { // 固件维度的强提醒开关
            enable: { type: Number }, // 0 关闭、1 开启
        },
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

