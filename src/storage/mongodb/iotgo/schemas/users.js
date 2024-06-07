const mongoose = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const hash = function (value) {
    return bcrypt.hashSync(value, 10);
};

const collectionName = 'users';
const schema = new Schema({
    nickname: { type: String },
    userStatus: { type: String },  //0 在线；1 活跃；2 静默
    phoneNumber: { type: String, index: true },
    email: { type: String, index: true },
    password: { type: String, required: true, set: hash },
    apikey: { type: String, unique: true, default: uuid.v4 },
    createdAt: { type: Date, index: true, default: Date.now },
    wxServiceId: { type: String }, //记录绑定的微信服务号ID
    wxAppId: { type: String },
    appId: { type: String },
    wxId: { type: String },  //wxId微信用户ID
    wxservicePrimiId: { type: String }, //微信原始ID
    bindAt: { type: Date, index: true },  //微信绑定时间
    mark: { type: String },  //0 微信绑定   1 微信未绑定
    lang: { type: String },  //语言
    //除APP外的各平台语言，类似 lang 字段，不包括小语种
    platformLang: {
        webEwelink: { type: String },        // pc 易微联的语言
    },
    weixinInfo: {
        subscribe: { type: String },//用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
        openid: { type: String },//用户的标识，对当前公众号唯一
        nickname: { type: String },//用户的昵称
        sex: { type: String },//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        city: { type: String },//用户所在城市
        country: { type: String },//用户所在国家
        province: { type: String },//用户所在省份
        language: { type: String },//用户的语言，简体中文为zh_CN
        headimgurl: { type: String },//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
        subscribe_time: { type: Date },//用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
        unionid: { type: String },//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。详见：获取用户个人信息（UnionID机制）
        remark: { type: String },//公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
        groupid: { type: String },//用户所在的分组ID
    },
    userType: { type: Number }, //0 或者没有表示易微联用户 1 facebook用户 后续扩展其他用户
    securityPhone: { type: String },
    isActivate: { type: Number },  //是否激活 0表示已经激活
    brandNum: { type: Number },   //创建品牌个数
    productModelNum: { type: Number },  //创建产品型号个数
    facebookInfo: {
        token: { type: String },
        applicationId: { type: String },
        userId: { type: String },
        exEmail: { type: String },
        expires: { type: String },
        lastRefresh: { type: String },
    },
    alexaPassword: { type: String },
    bindInfos: { type: Schema.Types.Mixed, default: {} },
    mpInfos: { type: Schema.Types.Mixed, default: {} },
    isAccepEmailAd: { type: Boolean },  //True 接受，false 拒绝
    countryCode: { type: String, required: true },
    currentFamilyId: { type: mongoose.Types.ObjectId },
    clientInfo: {
        model: { type: String },
        os: { type: String },
        imei: { type: String },
        romVersion: { type: String },
        appVersion: { type: String },
    },
    accountInfo: {
        level: { type: Number },  //会员等级，10=Free 20=Advanced 30=Pro
        validAt: { type: Date },  //生效时间
        expiredAt: { type: Date },  //过期时间
    },
    //以后有新增的杂项字段可能都放这里面
    extra: {
        accountConsult: { type: Boolean },   //true:接受过会员咨询
        trialMembership: { type: Boolean },  //true:已使用体验版7天会员
        freeTrialExpiredAt: { type: Date },  //体验版会员的过期时间
        ipCountry: { type: String },         //上一次调用apiv2接口时所在国家
        lastEmailAdAt: { type: Date },       //记录上一次修改用户是否订阅邮件的时间
        appForumEnterHide: { type: Boolean },//是否隐藏App内的社区入口，true=是
        historyClearTime: { // 历史记录清空时间
            msgCenter: { type: Date }, // 消息中心记录删除时间
        },
    },
    //额外的推送渠道信息
    extraPush: { type: Schema.Types.Mixed },
    //用户的语言(与lang不同，会有小语种)
    language: { type: String },
    timezone: {
        // Time Zone ID
        id: { type: String },
        // Time Zone Offset
        offset: { type: Number },
    },
    anonymousId: { type: String }, // 匿名账号id，格式：[匿名账号来源]_[匿名账号标识]
    isAnonymous: { type: Boolean }, //是否是匿名账号（和alexa的匿名账号不同）
    //sceneWxSubscription: { type: Object }//用户级场景微信订阅消息推送相关信息
    openId: { type: String },//第三方账号体系下的唯一ID，用于用户体系隔离
    uns: { type: String },//全称usernamespace，用于用户体系隔离
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
