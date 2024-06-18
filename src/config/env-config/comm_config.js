module.exports = {
    redis: {
        cache: {
            host: 'data-cache-redis.coolkit.run',
            port: 6379,
            options: {},
            cluster: true,
        },
        thirdPartyMsgQueue: {
            host: 'rec-msg-redis.coolkit.run',
            port: 6379,
            options: {},
            cluster: true,
        },
    },
    mongodb: {
        iotgo: {
            uri: 'mongodb://masterdb.coolkit.run:27017,slavedb.coolkit.run:27017/iotgo',
            options: {
                user: 'ckApiProject2',
                pass: 'J@88mO-p%Z1oK7c0ZS^HS<m)',
                dbName: 'iotgo',
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'myrepl3',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 2,
            },
        },
        otaDB: {
            // 走iotgo做权限认证
            uri: 'mongodb://masterdb.coolkit.run:27017,slavedb.coolkit.run:27017/iotgo',
            options: {
                user: 'ckApiProject2',
                pass: 'J@88mO-p%Z1oK7c0ZS^HS<m)',
                dbName: 'otaDB', // 实际连接的db是otaDB
                useNewUrlParser: true,
                bufferCommands: false,
                replicaSet: 'myrepl3',
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoIndex: false,
                poolSize: 1,
            },
        },
    },

    //appid的跨域域名
    //填写 "*" 代表允许所有跨域（现网不要做这个设置）
    //填写正则表达式代表允许跨域的域名
    appidCROSOrigin: {
        //易微联4.0
        'Uw83EKZFxdif7XFXEsrpduz5YyjP7nTl': /^http(s)?:\/\/(.+\.)?ewelink\.(cn|cc)$/,
        //网页版易微联
        'vcMG8oLY9CMf3CGg7g8tKlvatvPnRw84': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        //网页版易微联3.0
        'K0OCDSvIaBWdEaU4zxlKEwk26kmshoXK': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        //语音登录页
        'nFrIKo5ikTzPgoEeArJ3xjT3W3LLDB6n': /^http(s)?:\/\/(.+\.)?coolkit\.(cn|cc)$/,
        //摄像头网关
        'V9fnQjziO8pueRqnkWOCuipkGNS5ngfG': /^http:\/\/cameragateway\.local:\d+$/,
        //易微联社区
        '5NEFZmB3ix3bN6a5UBpI9WrvWgVidCDc': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //易微联开发者平台
        'cYVlgJNscL2NqO5RUSDdanXByRke9F6E': /^https:\/\/dev\.ewelink\.(cn|cc)$/,
        //cast app客户端
        'swiA0eXG5Sb4hH5aVLYakL8eWqYKDwFv': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        'WXg1dalR0Mh0bWWvAkZKmCm6TD68PiGW': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        'nXGtgMHc16p0pXNWRvzQMniBSdJc73TP': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        'jZ1l2hnfPz6cASFR4SOZ48cqnbPeL42a': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        'YgCzyGiGJou8jbyMvavUqMr6gi6A4hdz': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,
        'KSHOQxn9mebxBzcuehm1wzvSKJCk4fjf': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,

        //cast app客户端
        'CMwVQzxgAEsUSXzhwpRmVaF6NMRSQVHf': /^http(s)?:\/\/(.+\.)?(ewelink|coolkit)\.(cn|cc)$/,

        //第三方登录页
        //米家
        'aCyTJZEBTpfO0dvclA5bm1owO83rOF74': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //华为
        'gBsRJIObU2fTRuCe16FTPHcUCPAugiue': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //小度
        'eKGYWvdb9LlberkRIuF5PPSO8FnLZTqx': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //美的
        'kSGvCPLZZJowpmpBwcPuwkqykwELkaMZ': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //alice
        'c5gFTLcbRhWV2WuB9EipIS9VfrgYssne': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //google
        'W1MuNPHQFfTAfJhsoaSsMwMy8r42otat': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //smartthings
        'VANVGFCxzwNDvYfP5mw2ra4PRP3KmuZM': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //alexa
        'xLvXbVYi0X7MAcOAwr3S6OzuCPIBlFx5': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //ifttt
        'lrTJDH0Niht1ivlfgturwrjBh4lw70zh': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //aliGenie（天猫精灵）
        'FAyDgGPL79HmVZyxYwyHhilP3ZDhNRh3': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //Sber
        'DKhUYivDk6Mk2ulsJUupy7AphCrHHLnf': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // Home Assistant（Google定制技能）
        'i6lZgu5TYT9daUIMrtAJagtoP0urrdBg': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // Home Assistant（Alexa定制技能）
        'WRMCXo84yqh1xOLdlX0LX2QT7nA8PQ0w': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // （Google定制技能）
        'UFaGMrO00X6PF3aaS07nG3teuXduB350': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // （Alexa定制技能）
        '9f2qtCE5i6iPuoDXDHLLaURmxw3VRfGi': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // （Alexa美智光电定制技能）
        'DMz82tkTgEdpWBeMsFnyKETPHNSsDRC1': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // （Google美智光电定制技能）
        'hX0lUA2H5w1ZmBVbxHlV2llKnwkiIh8n': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        // （Google注销页）
        'R89whoxOsHmCqIWIWFmiKoX8Wa3u7xbS': /^https:\/\/c2ccdn\.coolkit\.cc$/,
        //  okp定制技能
        'fv3LFoaAO65cb5bfaKw6okoHzBVpVX1z': /^https:\/\/c2ccdn\.coolkit\.cc$/,
    },

    //一些接口需要特殊的跨域设置，根据path指定允许的跨域源域名
    //注意这里的跨域设置仅应用于HTTP OPTION方法，其它HTTP方法的跨域设置，应到具体方法的实现中，设置responseCtx.cros
    //具体做法参考utils/cros.js中的代码
    pathOptionCROSOrigin: {
        '/v2/utils/common-statistics': /^http(s)?:\/\/(.+\.)?coolkit\.(cn|cc)$/,
        '/report/ops_mode': '*',
        //oauth2授权页使用
        '/v2/user/oauth/code': /^http(s)?:\/\/(test-)?c2ccdn\.coolkit\.(cn|cc)/,
        '/v2/user/qr-code': /^http(s)?:\/\/(test-)?c2ccdn\.coolkit\.(cn|cc)/,
        '/v2/user/qr-code/status': /^http(s)?:\/\/(test-)?c2ccdn\.coolkit\.(cn|cc)/,
    },

    //kinesis日志
    kinesisLog: {
        enable: false,
    },

    //kinesis日志分类配置
    kinesisCategory: {
        //开发调试
        develop: 1000,
        //接口汇总
        overview: 1001,
        //通用错误
        commonError: 1002,
        //用户
        user: 1010,
        //设备相关
        thing: 1011,
        //短信，email，推送等消息推送
        sendMessage: 1012,
        //旧api获取设备列表
        getDeviceList: 1013,
        //通用统计
        commonStatistics: 1014,
        //异步任务队列
        asyncTaskQueue: 1015,
        //内购订单日志
        iapOrders: 1016,
        //优惠券发放日志
        couponIssued: 1017,
        //埋点数据
        eventTracking: 1018,
        //消息回执
        messageReceipt: 1019,
    },

    //redis缓存的过期时间(秒)
    redisCacheTtl: {
        //登录token信息
        accessToken: 3600,
        //用户信息
        user: 3600,
        //设备信息
        device: 300,
        //设备群组信息
        deviceGroup: 600,
        //设备出厂信息
        fd: 7200,
        //thing列表
        thingList: 3600,
        //轻智能小程序添加设备流程中生成的code
        crc32DeviceCode: 60,
        //ipc二维码的key
        ipcQRCodeKey: 600,
        //ipc二维码的index
        ipcQRCodeIndex: 610,
        //二维码添加设备的结果
        ipcQRCodeDevices: 610,
        //活动信息
        activity: 300,
        //优惠券余量报警, 6小时
        couponRemainingWarn: 21600,
        //设备温湿度历史数据上报标志,1小时
        deviceTempHumReport: 3600,
        //设备扩展服务结果,15分钟
        devExtSrv: 900,
        //云存推送图片gif资源标志位，25秒
        cvFrameRes: 25,
        //云存推送图片状态及下载链接的缓存，30分钟
        cvFrameInfo: 1800,
        //触发设备功能链接的有效时间，15分钟
        deviceTriggerUrl: 900,
        // 绑定 nspro 二维码过期时间
        addnsproQRCodeKey: 300,
        // 登录设备二维码过期时间
        addByLoginThroughQRCodeKey: 300,
        // 用户的客户端设置，1小时
        userClientSettings: 3600,
        // 接口调用限制标志位：5秒
        invokeFDNum: 5,
    },

    //appid鉴权白名单，在名单中的appid不会做接口权限校验，全部通过
    appidWhiteList: new Set([
        //易微联3.1.4
        'oeVkj2lYFGnJu5XUtWisfW4utiN4u9Mq', //现网
        '1xMdjbmOBYctEJfye4EjFLR2M6YpYyyJ', //测试

        //易微联4.0
        'Uw83EKZFxdif7XFXEsrpduz5YyjP7nTl', //现网
        '1xMdjbmOBYctEJfye4EjFLR2M6YpYyyJ', //测试

        //StepGMS
        '2cNUuXZxft97bwaqjjYZeSV3S5dgnDjY', //现网
        'sXSDuLTMkyQzfhRBu4YC4YkbRGkirYpa', //测试

        //云达开
        '7LvIOdG5L9eJ6IIDn9zZJqWTWbcEaCdh', //现网

        //v-tac
        'QFO1mYM8k0pSvE3tijD75hlDDL89cqK6', //现网
        'PwNwhLOYUObU21lkykPRoDaWchfNxEcO', //测试
    ]),
};