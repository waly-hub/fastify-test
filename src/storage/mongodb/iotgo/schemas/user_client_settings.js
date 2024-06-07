const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_client_settings';
const schema = new Schema({
    apikey: { type: String, required: true },
    appid: { type: String, required: true },

    //客户端配置
    settings: {
        darkMode: {                         //深色模式
            enabled: { type: Boolean },
            mode: {type: Number},    // 普通模式：1; 深色模式：2; 跟随系统：3
        },
        nfc: {                              //NFC
            enabled: { type: Boolean },
        },
        dem: {                              //设备能耗
            enabled: { type: Boolean },
        },
        newDevicePairingPage: {             //新版设备配网页面
            enabled: { type: Boolean },
        },
        marketingNotification: {            //营销推送通知开关
            enabled: { type: Boolean },
            monthlyCount: { type: Number },     //月推送次数计数
            lastPushedAt: { type: Date },       //上次推送的时间
        },

        /**
         * 应用的社区入口隐藏。
         * 该项属于黑白名单，false将表示即使所在区关闭了社区入口，也会在用户登录应用后展示社区入口；
         * 反之则是封禁入口；没值则应该看各区默认的社区策略
         */
        appForumEnterHide: { type: Boolean },

        /**
         * 用户在客户端上选定的语言，因各端语种对应的值可能不同，所以当需要云端存储语言时，应该使用与易微联App约定的langTag
         * 用户不选则没有这个字段
         */
        language: { type: String },

        /**
         * 客户端默认语言，与 language 不同，lang目前只有cn、en
         * 主要让服务端识别通知推送等需要发送什么语言
         */
        lang: { type: String },

        /**
         * 客户端信息，各端不统一，所以用Mixed
         */
        clientInfo: { type: Schema.Types.Mixed },

        /**
         * 推送通道配置
         * App: 额外推送渠道，优先级高于友盟，友盟作为服务的默认渠道不会记录在这里
         */
        pushChannel: { type: Schema.Types.Mixed },
    },

    //客户端标记
    marks: {
        //用户当前的手机上是否设置了安卓小组件
        useAndroidWidget: { type: Boolean },
    },
}, { collection: collectionName, timestamps: true });

module.exports = {
    name: collectionName,
    schema: schema,
};

/**
 * 用户的客户端配置
 * 
 * 联合唯一索引：{ apikey: 1, appid: 1 }
 */

/**
 * 多端登录兼容
 * 1. 方向1：开新表，维度下到 endpoint，将端配置移到新表
 */ 