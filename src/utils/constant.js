module.exports = {
    //api协议中定义的http header的key
    headersKey: {
        appid: 'x-ck-appid',
        nonce: 'x-ck-nonce',
        seq: 'x-ck-seq',
        authorization: 'authorization',
    },

    //通用错误码
    errorCode: {
        noError: 0,  //无错误
        paramsError: 400,  //参数错误，通常是缺少接口必须的参数，或者参数的类型或值错误
        accessTokenError: 401,  //access token认证错误，通常是账号被其他人登录，导致当前access token失效
        accessTokenExpired: 402,  //access token过期
        apiNotFound: 403,  //找不到接口，通常是接口url写错
        resourceNotFound: 405,  //找不到资源，通常是在后端数据库中查不到必需的数据记录
        deny: 406,  //拒绝操作，通常是当前用户无权操作指定资源
        unauthorizedAppID: 407,  //使用的appid无权调用该接口
        appidExpired: 408,  //appid已过期
        qrCodeExpired: 409, //二维码已过期
        qrCodeNotHere: 410, //二维码不在本区域
        qrCodeAlreadyUsed: 411, //二维码已被使用
        invokeTooMuch: 412, //调用次数过多
        seqExpired: 413, //签名时间戳过期
        businessBusy: 414,    //业务繁忙
        internalError: 500,  //lambda内部错误，通常是lambda的接口代码出错
        otherInternalServiceError: 510,   //lambda调用公司内部的其他服务（比如智能场景）出错引起的错误，
        mongodbError: 511,   //数据库读写异常
        duplicateIndexError: 512,//由于唯一索引导致写数据库失败
        reachESError: 513,//访问ES数据失败
        otherExternalServiceError: 520, //lambda调用外部服务（比如友盟）出错引起的错误
    },

    //thing类型
    thingType: {
        noRelation: 0,
        myDevice: 1,  //我的设备
        shareDevice: 2,  //别人分享给我的设备
        myDeviceGroup: 3,  //我的设备群组
        shareDeviceGroup: 4,  //别人分享给我的设备群组（保留，目前用不到）
        shareFamilyMyDevice: 5, //他人家庭下主人端设备
        shareFamilyShareDevice: 6,  //他人家庭下被分享的设备（保留，目前用不到）
        shareFamilyMyDeviceGroup: 7,    //他人家庭下主人端群组
    },

    //2.4G蓝牙虚拟设备
    bleVirtualDeviceSetting: {
        //二维码协议代号
        protocolCode: {
            zx: '1',  //兆宣
            wxd: '2', //无线道
            hbw: '3',  //鸿博微
            penetrate: '4',   //透传类型
        },
    },

    //redis缓存的key定义
    redisCacheKey: {
        //用户信息
        //类型：string
        //格式:iotgo.users_[apikei]
        userPrefix: 'iotgo.users_',

        //设备信息
        //类型:string
        //格式:iotgo.devices_[deviceid]
        devicePrefix: 'iotgo.devices_',

        //设备额外信息
        //类型:string
        //格式:iotgo.devices_[deviceid]
        deviceExtraInfosPrefix: 'iotgo.devices_extra_infos_',

        //用户在其他平台的信息
        //类型:string
        //格式:iotgo.user_client_infos_[wxAppid]_[openid]
        userClientInfosPrefix: 'iotgo.user_client_infos_',

        //设备群组信息
        //类型:string
        //格式:iotgo.devgroup_[群组id]
        deviceGroupPrefix: 'iotgo.devgroup_',

        //出厂设备信息
        //类型:string
        //格式:iotgo.fd_[deviceid]
        fdPrefix: 'iotgo.fd_',

        //用户登录的accessToken
        //类型:string
        //格式:iotgo.at_[accessToken]
        atPrefix: 'iotgo.at_',

        //thing列表（包括设备和群组）
        //类型:zset
        //格式: iotgo.tl_[familyid]
        thingListPrefix: 'iotgo.tl_',

        //轻智能小程序添加设备流程中生成的code
        //类型string
        //格式: iotgo.crc32code_123abc
        crc32DeviceCode: 'iotgo.crc32code_',

        //验证码1分钟内申请次数
        //类型int
        //格式: user_vcode_1m_{email或phone}
        minuteVerificationCodePrefix: 'user_vcode_1m_',

        //验证码1小时内申请次数
        //类型int
        //格式: user_vcode_1h_{email或phone}
        hourVerificationCodePrefix: 'user_vcode_1h_',

        //验证码1天内申请次数
        //类型int
        //格式: user_vcode_1d_{email或phone}
        dayVerificationCodePrefix: 'user_vcode_1d_',

        //重置密码操作1分钟内申请次数
        //类型int
        //格式: user_resetPwd_1m_{ip}
        minuteResetPwdPrefix: 'user_resetPwd_1m_',

        //重置密码操作1小时内申请次数
        //类型int
        //格式: user_resetPwd_1h_{ip}
        hourResetPwdPrefix: 'user_resetPwd_1h_',

        //重置密码操作1天内申请次数
        //类型int
        //格式: user_resetPwd_1d_{ip}
        dayResetPwdPrefix: 'user_resetPwd_1d_',

        //重置密码操作验证码输入错误次数
        //类型int
        //格式: user_resetPwdWrongCode_{账号base64的值}
        resetPwdWrongCodePrefix: 'user_resetPwdWrongCode_',

        //国内/国际短信分流计数
        //类型int
        //格式: iotgo:counter:(sms|ims)
        smsCounter: 'iotgo:counter:',

        //获取30s内请求上传日志到s3的预签名url的次数
        //类型int
        //格式：s3upload_url_{apikey}
        s3UploadUrlPrefix: 's3upload_url_',

        //获取10s内请求上传设备配网数据到s3的预签名url的次数
        //类型int
        //格式：s3upload_devConData_url_{apikey}
        s3UploadDevConDataUrlPrefix: 's3upload_devConData_url_',

        //IPC二维码的密钥缓存
        //类型: hash
        //格式: ipcKey_{key}
        ipcQRCodeKeyPrefix: 'ipcKey_',

        //IPC二维码的索引值缓存
        //类型： string
        //格式： ipcAt_{index}
        ipcQRCodeIndexPrefix: 'ipcAt_',

        //IPC二维码的设备添加结果缓存
        //类型： list
        //格式： ipcDevices_{index}
        ipcQRCodeDevicesPrefix: 'ipcDevices_',

        //app内购的分布式锁
        //类型： string
        //格式： iap.mutex_{id}
        iapMutexPrefix: 'iap.mutex_',

        //CMS文章点赞数缓存
        //类型： string
        //格式： cmsPostApprove_{approveId}
        cmsPostApprovePrefix: 'cmsPostApprove_',

        //指定ip在30s内请求匿名登录接口的次数
        //类型： int
        //格式： anonymousLogin_{appid}_{ip}
        anonymousLoginPrefix: 'anonymousLogin_',

        /*小程序相关————开始*/

        //小程序相关缓存数据前缀
        miniProgramPrefix: 'wx.miniProgram.',

        /*小程序相关————结束*/

        //活动信息
        //类型: string
        //格式: activity_{id}
        activityPrefix: 'activity_',

        //上次优惠券余量告警时间
        //类型: string
        //格式: couponRemainingWarn_${category}
        couponWarnPrefix: 'couponRemainingWarn_',

        //设备温湿度历史数据上报标志
        //类型: string
        //格式：deviceTempHum_${id}
        deviceTempHumReportPrefix: 'deviceTempHum_',

        //设备使用情况相关的redis缓存
        deviceUsagePrefix: 'iotgo:deviceUsage',

        //需要采集温湿度数据的设备列表
        //类型: set
        //格式: iotgo:device:tempHumCollactionList
        tempHumCollactionListPrefix: 'iotgo:device:tempHumCollactionList',

        //设备当前生效套餐缓存
        //类型: string
        //格式: devExtSrv:md5({用户apikey}_{deviceid}_{srvType})
        devExtSrvPrefix: 'devExtSrv:',

        //绑定 nspro 二维码的信息缓存
        //类型: hash
        //格式: addnspro_{deviceid}
        addnsproQRCodeKeyPrefix: 'addnspro_',

        //登录设备二维码的信息缓存
        //类型: hash
        //格式: addByLoginThroughQRcode__{deviceid}
        addByLoginThroughQRCodeKeyPrefix: 'addByLoginThroughQRcode_',

        //二维码登录的二维码缓存
        //类型：string
        //格式：qrCode_
        qrCodePrefix: 'qrCode_',

        //接口调用次数
        //类型: string(实际使用incr，当作数字用)
        //格式: apiInvokeTimes_${唯一id（appid、method+path等）}
        apiInvokeTimesPrefix: 'apiInvokeTimes_',

        //oauth2相关
        //类型: string
        //格式: oauth2.xxxx
        oauth2Prefix: 'oauth2.',

        //用户的客户端设置
        //类型: string
        //格式: userClientSettings:md5(apikey+appid)
        userClientSettingPrefix: 'userClientSettings:',

        //动态加载白名单
        //类型: string
        //格式: dynamicLoadWhiteList:all（只有一种all）
        dynamicLoadWhiteListPrefix: 'dynamicLoadWhiteList:',

        //云存推送图片GIF资源标记
        //类型: string
        //格式: cvFrameRes:${md5(用户apikey_deviceid)}
        cvFrameResPrefix: 'cvFrameRes:',

        //云存推送图片状态及下载链接的缓存
        //类型: hash
        //格式: cvFrameInfo:${pushFrameUrlPath}
        //弃用，新消息中心方案迁移完成后，这个缓存可以移除；新缓存见 mediaSrcReadyStatePrefix
        cvFrameInfoPrefix: 'cvFrameInfo:',

        //触发设备功能的链接id
        //类型: string
        //格式: deviceTriggerUrl:${id}
        deviceTriggerUrlPrefix: 'deviceTriggerUrl:',

        //媒体资源ready缓存
        //类型: string
        //格式: iotgo:media:src:MD5(资源存储位置，例如s3地址)
        mediaSrcReadyStatePrefix: 'iotgo:media:src:',

        //媒体资源下载url缓存
        //类型: string
        //格式: iotgo:media:src:MD5(资源存储位置，例如s3地址)
        mediaSrcDownloadUrlPrefix: 'iotgo:media:url:',

        //会员过期推送缓存
        //类型: string
        //格式: memberExpire:apikey(用户apikey)
        memberExpirePrefix: 'memberExpire:',

        // matter hub消息队列
        // 类型：list
        // 格式：向队列名插入消息，具体消息格式见方案文档(https://itead.yuque.com/nfgzbt/dmsqx8/obhy8u6yr017xxf3#err8r)
        matterHubMsg: 'matterHubMsg',

        //接口调用限制创建文档写入锁
        //类型: string
        //格式: invokeFDNum:apikey(用户apikey)
        invokeFDNum: 'invokeFDNum:',

        // 乐帆扫地机器人地图
        // 类型：list
        // 格式：sweepingRobotMaps:deviceDataId:mapId
        sweepingRobotMapsPrefix: 'sweepingRobotMaps:',

        //服务锁
        //类型: string
        //格式: service:lock:${服务名}:${MD5(id)}
        serviceLockPrefix: 'service:lock:',
    },

    reCalculateInterval: 300 * 1000,    //重新计算配额间隔：300s

    //家庭房间业务的错误码
    familyErrorCode: {
        initFamilyError: 20001,  //首次创建家庭失败
        familyRoomLimit: 20002,  //创建家庭或房间时，数量超出限制
        deleteFamilyDeny: 20003,  //只有一个家庭，拒绝删除
        alreadyShare: 20004,    //家庭不能重复分享给同一人
        masterMustDifferentFromMember: 20005,   //家庭不能分享给自己
        familyShareReachLimit: 20006,   //该家庭分享到达上限
        masterInfoNotFound: 20007,  //分享者账号已注销
        memberInfoNotFound: 20008, //被分享者账号不存在
        shareFamilyNotFound: 20009,  //被分享的家庭不存在
        alreadyNotFamilyMember: 20010, //取消家庭分享时，对方已经不是家庭成员
        cardExpired: 20011, //卡片过期
        shareFailedBecauseInAnotherRegion: 20012,   //因分享对象在其他区而失败
        memberAppVersionInvalid: 20013, //分享对象app版本太低
        overAcceptCardLimit: 20014, //接受该家庭卡片分享的人数超过限制（由于前端文案错误，换成下方的错误码）
        overAcceptCardLimitNew: 20015, //接受该家庭卡片分享的人数超过限制
        memberTooLowToSetExpiredAt: 20016, //会员等级不足以设置分享有效期
    },

    //家庭类型
    familyType: {
        noRelation: 0,//无关系
        myFamily: 1,//自己的家庭
        shareFamily: 2,//别人分享的家庭
    },

    //会员相关策略
    memberInterests: {
        free: {
            //会员等级
            level: 10,
            //会员名称
            name: {
                en: 'Free',
                cn: '普通会员',
            },
            //资源限制
            resourceLimit: {
                //家庭分享最大数量
                familyShareMax: 5,
                //家庭最大数量
                familyMax: 5,
                //所有家庭的房间总和的最大数量
                roomMax: 100,
                //手动场景最大数量 (仅旧版本智能场景服务使用，智能场景v2已弃用)
                manualSceneMax: 150,
                //自动场景最大数量（包括联动、定时、日出日落）(仅旧版本智能场景服务使用，智能场景v2已弃用)
                autoSceneMax: 150,
                // totalSceneMax 手动场景 + 自动场景 的最大数量
                totalSceneMax: 300,
                //设备群组最大数量
                deviceGroupMax: 50,
                //设备分享的最大用户数
                deviceShareMax: 20,
                //允许添加的摄像头数
                cameraAppCount: 1,
                //摄像头网关允许添加的子设备数量
                cameraGatewaySubDeviceMax: 1,
            },
        },
        advanced: {
            //会员等级
            level: 20,
            //会员名称
            name: {
                en: 'Advanced',
                cn: '高级会员',
            },
            //资源限制
            resourceLimit: {
                //家庭分享最大数量
                familyShareMax: 10,
                //家庭最大数量
                familyMax: 10,
                //所有家庭的房间总和的最大数量
                roomMax: 200,
                //手动场景最大数量(仅旧版本智能场景服务使用，智能场景v2已弃用)
                manualSceneMax: 500,
                //自动场景最大数量（包括联动、定时、日出日落）(仅旧版本智能场景服务使用，智能场景v2已弃用)
                autoSceneMax: 500,
                // totalSceneMax 手动场景 + 自动场景 的最大数量
                totalSceneMax: 1000,
                //设备群组最大数量
                deviceGroupMax: 200,
                //设备分享的最大用户数
                deviceShareMax: 100,
                //允许添加的摄像头数
                cameraAppCount: 5,
                //摄像头网关允许添加的子设备数量
                cameraGatewaySubDeviceMax: 10,
            },
        },
        pro: {
            //会员等级
            level: 30,
            //会员名称
            name: {
                en: 'Pro',
                cn: '超级会员',
            },
            //资源限制
            resourceLimit: {
                //家庭分享最大数量
                familyShareMax: 50,
                //家庭最大数量
                familyMax: 50,
                //自己所有家庭的房间总和的最大数量
                roomMax: 1000,
                //手动场景最大数量 (仅旧版本智能场景服务使用，智能场景v2已弃用)
                manualSceneMax: 2500,
                //自动场景最大数量（包括联动、定时、日出日落） (仅旧版本智能场景服务使用，智能场景v2已弃用)
                autoSceneMax: 2500,
                // totalSceneMax 手动场景 + 自动场景 的最大数量
                totalSceneMax: 5000,
                //设备群组最大数量
                deviceGroupMax: 5000,
                //设备分享的最大用户数（实际不受限制）
                deviceShareMax: 9999,
                //允许添加的摄像头数
                cameraAppCount: 9999,
                //摄像头网关允许添加的子设备数量
                cameraGatewaySubDeviceMax: 50,
            },
        },
    },
};