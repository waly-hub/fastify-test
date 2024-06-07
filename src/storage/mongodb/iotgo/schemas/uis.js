const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'uis';
const schema = new Schema({
    ui: { type: String, index: true },
    desc: { type: String },
    uiid: { type: Number },
    settings: {
        pushSettings: { type: Schema.Types.Mixed, default: {} },
        stateReportSettings: { type: Schema.Types.Mixed, default: {} },
        historySettings: { type: Schema.Types.Mixed, default: {} },
        pushContent: { type: Schema.Types.Mixed, default: {} },
    },
    devConfig: {
        tcReqPeriod: { type: Number },
        tcReqMax: { type: Number },
    },
    featureConf: { type: Object },  //功能可配置所用字段
    isSupportGroup: { type: Boolean },  //true代表支持创建群组，false代表不支持创建群组
    isSupportedOnMP: { type: Boolean },  //true代表小程序上支持该uiid，false代表不支持
    isSupportChannelSplit: { type: Boolean },  //true代表支持多通道拆分，反之则不支持
    defaultParamsFields: [{ type: String }],    //标志客户端可以设置该uiid的哪一些初始params字段
    matterSupport: { enable: { type: Boolean } }, // 是否具备matter能力 enable=true表示具备,false表示不具备
    matterHubSupport: { // 是否具备matter hub能力
        enable: { type: Boolean }, // enable=true表示具备该能力,false表示不具备
        fwVersion: { type: String }, // 当enable=true时，fwVersion字段可能存在，表示大于某个固件版本才具备该能力
    },
    appStatic: { // 客户端uiid静态资源配置
        dynamicLoad: [ // 动态加载资源配置列表，供客户端下载配置文件
            {
                type: { type: String }, // 软件包类型，支持debug和release，debug仅测试用户可见
                configPath: { type: String }, // 配置文件下载路径，文件内包含了该uiid动态加载的配置和需要的资源详情
                eweLinkLeastVersion: { type: String }, // 支持该配置所需的app版本，目前只考虑支持易微联app
                index: { type: Number }, // 软件包序号，数字越大越新
            },
        ],
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
