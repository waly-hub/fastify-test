module.exports = {
    UIID: {
        outlet: 1,  //单通道插座
        outlet_2: 2,  //双通道插座
        outlet_3: 3,  //三通道插座
        outlet_4: 4,  //四通道插座
        outlet_power: 5,  //功率检测单通道插座
        switch: 6,  //单通道开关
        switch_2: 7,  //双通道开关
        switch_3: 8,  //三通道开关
        switch_4: 9,  //四通道开关
        penetrate: 10,  //透传模块
        curtain: 11,  //电动窗帘
        oilTing: 12,  //智能油汀
        fireplace: 13,  //智能壁炉
        switchModification: 14,  //开关改装模块(单通道开关)
        thermostatic: 15,  //恒温恒湿改装件
        coolAndWarmLight: 16,  //冷暖双色调光灯
        fan: 17,  //三档摇头智能风扇
        sensorCenter: 18,  //传感器中心(带温度 湿度 亮度 噪音 空气质量传感器数据)
        humidifier: 19,  //三档加湿器
        bitEyeCamera: 20,  //比特眼摄像头
        multifunctionalFan: 21,  //日彩多功能风扇，加湿，蚊香
        rgbColoredBulbLight: 22,  //RGB五色球泡灯
        nest: 23,  //NEST温控器
        switchGsm: 24,  //GSM单通道开关
        aromamachine: 25,  //香薰机
        thermostat: 26,  //瑞米特温控器
        switchGsmFlow: 27,  //GSM单通道开关包流量 不显示手机号码输入
        rfBridge: 28,  //RFBridge WiFi转RF无线遥控器
        switchGsm_2: 29,  //GSM双通道开关插座
        switchGsm_3: 30,  //GSM三通道开关插座
        switchGsm_4: 31,  //GSM四通道开关插座
        switchPower_Warning: 32,  //功率检测插座过载告警 功率检测插座 可设置过载保护告警
        rgbLightStripController: 33,  //RGB灯带控制器 基于透传模块协议的RGB灯带控制器
        fanLight: 34,  //智能风扇灯 3档风扇灯 基于4通道开关协议
        ezvizCamera: 35,  //萤石摄像头
        dimmerSwitch: 36,  //基于RGB灯带控制器透传模块协议的单路调光开关
        gsmTc: 37,  //GSM透传测试
        homeKitBridge: 38,  //HomeKit Bridge
        ywjLock: 39,  //亿万家网关 目前仅支持门锁
        outdoorWeatherStation: 40,  //富金支持户外气象站
        villageDoor: 41,  //台湾定制项目 村宥门
        ambientLight: 42,  //床头氛围灯 基于透传模块的 床头灯 氛围灯 新球泡灯 （杜工灯带协议版本）
        setTopBox: 43,  //机顶盒保护双通道UI
        dimmingLight: 44,  //基于BLA调光模块的单色调光灯(智能调光器)
        downlight: 45,  //筒灯及新吸顶灯 基于LA固件的单通道筒灯/新吸顶灯
        airPurifier: 46,  //智能空气净化器
        airConditioning: 47,  //智能空调
        odorless: 48,  //无味煲
        electricBed: 49,  //飞士卡智能电动床（沙发）
        heater: 50,  //智能暖风机
        coldAndWarmLamp: 51,  //基于透传模块 灯带协议的冷暖双路UI
        ceilingLight: 52,  //基于LA模块的两路输出，一路调整亮度一路调整色温。三友吸顶灯使用
        electricFanWithLamp: 53,  //带灯电风扇 透传模块协议
        pushThePetDoor: 54,  //澳大利亚定制项目使用的推拉宠物门UI
        robot: 55,  //扫地机器人
        rgb4ColoredBulbLight: 56,  //RGB四色球泡灯	基于原来RGB五色球泡灯UI修改的四色球泡灯
        monochromaticDimmer: 57,  //单色球泡灯 基于LA协议的一个通道调光UI
        rhythmicBelt: 59,  //律动灯带
        kaiweiRouter: 61,  //开维路由器
        p2pCamera: 62,  //p2p摄像头（觅锐）
        vsProjector: 63,  //ViewSonic投影仪
        heatingTable: 64, //取暖桌
        ewelinkCamera: 65, //易微联手机摄像头，使用尚云方案
        zigbeeGateway: 66,  //zigbee网关
        rollingShutterDoor: 67,  //卷帘门
        koochuwahAlarm: 68,  //古诸华安防报警器
        voiceAmbientLight: 69,  //语音氛围灯
        outlet77: 77,  //单通道插座，使用多通道协议
        switch78: 78,  //单通道开关，使用多通道协议
        christmasLamp: 79,  //圣诞灯带
        outletGsm81: 81,  //GSM单通道插座，使用多通道协议
        outletGsm82: 82,  //GSM双通道插座，使用多通道协议
        outletGsm83: 83,  //GSM三通道插座，使用多通道协议
        outletGsm84: 84,  //GSM四通道插座，使用多通道协议
        iotCamera: 87,  //大云智联摄像头，IOT摄像头，使用尚云方案
        smartInfrared: 88,  //智能红外(遥控大师)
        sleekDoorWindow: 89,  //斯李克门窗
        rfGsm: 90,  //GSM版本的RFBridge
        richMatSmartBed: 92,  //卓兴普电动床
        zigbeeInfraredGateway: 96,  //瑞福来Zigbee加红外网关
        rfGateway: 98,  //RF网关
        miruiCamera: 101,   //觅睿摄像头
        wifiDoorContact: 102,  //wifi门磁
        lamp103: 103, //新型双色球泡灯，支持随调
        lamp104: 104, //新型五色球泡灯，支持随调
        gsm107: 107,  //GSM单通道插座，使用多通道协议 含流量设备使用
        lamp108: 108,  //RGB四色灯，支持随调及场景
        wifi2InfraredGateway: 109,  //易微联Zigbee加红外网关
        tenbayZigbee: 111,  //天贝Zigbee网关
        singleChannelRadar: 112,    //雷达单通道
        doubleChannelRadar: 113,    //雷达双通道
        tripleChannelRadar: 114,    //雷达三通道
        ewelinkBleSwitch1: 118,  //易微联2.4G蓝牙单通道开关遥控器（兆宣协议）
        ewelinkBleSwitch2: 119,  //易微联2.4G蓝牙双通道开关遥控器（兆宣协议）
        ewelinkBleSwitch3: 120,  //易微联2.4G蓝牙三通道开关遥控器（兆宣协议）
        ewelinkBleSwitch6: 121,  //易微联2.4G蓝牙六通道开关遥控器（兆宣协议）
        wxdBleMixLight: 122,  //无线道2.4G蓝牙 MIX 灯类遥控器
        wxdBleWtLight: 123,  //无线道2.4G蓝牙 WT 灯类遥控器
        wxdBleRgbLight: 124,  //无线道2.4G蓝牙 RGB 灯类遥控器
        wxdBleRgbWtLight: 125,  //无线道2.4G蓝牙 RGB WT 灯类遥控器
        dualr3Switch2: 126,    //多功能双通道电量检测开关（Dualr3）
        newThermostat: 127,     //新版温控器
        stackMeter: 128,    //堆叠式电表
        candleLight: 129,   //蜡烛灯
        stackMeterSubOutlet_4: 130, //堆叠式电表的四通道插座子设备
        blueToothDoorControl: 131,        //蓝牙2.4g门控
        blueToothCurtainControl: 132,        //蓝牙2.4g窗帘控制
        nspanel: 133,        //NSPanel
        infraredLamp: 134,  //2.4g红外小夜灯
        blBle2Light: 135,   //博流双色灯
        blBle5Light: 136,   //博流五色灯
        rhythmicBeltBle: 137,    //律动灯带蓝牙版
        basicR4Switch1: 138,    //basicR4单通道插座_支持2.4G轻智能
        basicR4Switch2: 139,    //basicR4双通道插座_支持2.4G轻智能
        basicR4Switch3: 140,    //basicR4三通道插座_支持2.4G轻智能
        basicR4Switch4: 141,    //basicR4四通道插座_支持2.4G轻智能
        hue2Light: 145, //飞利浦色温灯
        hue5Light: 147, //飞利浦彩光灯Pro
        remoteTunableWhiteLight: 148,   //轻智能双色冷暖灯遥控器
        lightSmartGateway: 149, //轻智能网关
        mideaAirConditioner: 151,   //美的空调
        penetrateBleFan: 152,   //中恒轻智能风扇
        wifiDoorContact154: 154,    //wifi门磁（通用）
        humanInfraredSensor: 155,   //wifi人体红外传感器
        keyboard: 156,          //keyboard
        t5Switch1: 160,         //T5单通道开关
        t5Switch2: 161,         //T5双通道开关
        t5Switch3: 162,         //T5三通道开关
        t5Switch4: 163,         //T5四通道开关
        remotePlantLight: 164,  //轻智能植物灯
        duarlr3LiteSwitch2: 165,       //多功能双通道开关_支持电机模式（Duarlr3 Lite）
        lamp166: 166,           //盛达光电PWM五色灯
        smartRollingGate: 167,  //轻智能卷闸门
        zigbeeBeepGateway: 168, //zigbee蜂鸣网关
        smartFanLight: 169, //三挡交流风扇灯（箭丰）
        cameraGateway: 170,      //易微联摄像头网关
        cameraGatewaySubDevice: 171,      //易微联摄像头网关子设备
        nspanelLightSmartGateway: 172,  //新的轻智能网关
        ribbonMagicLights: 173,  //幻彩灯带-Sonoff
        R5: 174,    //情景开关（六按键）
        mideaWaterHeater: 175,  //美的热水器
        mideaWashingMachine: 176,   //美的洗衣机
        SMATE: 177, //开关伴侣
        mideaElectricHeater: 178, //美的电暖气
        THR3: 181,  //恒温恒湿改装件 THR3
        switchPower_Warning_multiCH: 182,   // 功率检测插座过载告警-多通道协议
        smartthingsSwitch: 187, // SmartThings 开关插座
        smartthingsRGBLight: 188, // SmartThings 五色灯
        POWR3: 190,     //POWR3
        switch191: 191, //2.4G单通道插座-支持轻智能网关
        switch192: 192, //2.4G双通道插座-支持轻智能网关
        switch193: 193, //2.4G三通道插座-支持轻智能网关
        switch194: 194, //2.4G四通道插座-支持轻智能网关
        nspanelPro: 195, //松诺中控屏（海外版）
        LefantSweepRobot: 202, //乐帆扫地机器人
        nspanelProCn: 203, //中国区中控屏
        iHost: 204, //iHost，旧名称 aiBridge
        sonoffWebRtcCamera: 208,     //松诺WebRTC摄像头
        t5TouchSwitch1: 209,         //T5触摸单通道开关
        t5TouchSwitch2: 210,         //T5触摸双通道开关
        t5TouchSwitch3: 211,         //T5触摸三通道开关
        t5TouchSwitch4: 212,         //T5触摸四通道开关
        ECAM: 215,         //双目变焦摄像头
        RTSPCamera: 217, // RTSP摄像头
        nsProEwelink: 219, // 酷宅中控屏_国外版
        castApp: 223, //cast app，从应用商店下载的app，在登录web cast的账号后需要注册成设备
        remoteStartCard: 225, //远程开机卡
        nsProVer120: 228, //nspro120版本，美规地区特供，主控芯片更新，基于195打包
        nsProMideaLight: 229, //美智光电中控屏，基于219打包
        wifiCircuitBreaker: 226, //WIFI断路器
        //zigbee子设备
        smartMPDeivce: 230, //轻智能小程序子设备
        kylingGuardDoorBell: 233, // 麒石超级门铃
        zigbeeUltraMatterCoolkit: 241, //Zigbee网关-Matter版(酷宅)
        zigbeeUltraMatterSonoff: 243, //Zigbee网关-Matter版(松诺)
        cardCamera: 256,  //松诺卡片机摄像头
        zigbeeSwitch: 1000,	 //zigbee开关
        zigbeeOutlet: 1009,  //Zigbee插座
        zigbeeLightController: 1256,  //Zigbee灯控制器
        zigbeeDimmingLight: 1257,  //Zigbee单色灯
        zigbeeCoolAndWarmLight: 1258,  //Zigbee双色灯
        zigbeeCurtain: 1514, //Zigbee窗帘电机
        zigbeeThermostatic: 1769, //Zigbee恒温器
        zigbeeTemperatureHumiditySensor: 1770, //Zigbee温湿度传感器
        zigbeeTemperatureHumiditySensorWithScreen: 1771, //Zigbee支持的带屏温湿度传感器
        zigbeeMotionSensor: 2026, //Zigbee移动传感器
        zigbeeSwitch2: 2256, //Zigbee双通道开关
        zigbeeContactSensor: 3026, //Zigbee门窗传感器
        zigbeeSwitch3: 3256, //Zigbee三通道开关
        zigbeeRgbLight: 3258,  //Zigbee五色灯
        zigbeeWaterSensor: 4026, //Zigbee水浸传感器
        zigbeeSwitch4: 4256, //Zigbee四通道开关
        zigbeeSmokeSensor: 5026, //Zigbee烟雾传感器
        zigbeeTemperatureHumiditySensorOTA: 7001, //Zigbee温湿度传感器(支持OTA)
        zigbeeSwitchOTA: 7004,  //Zigbee单通道开关­_支持OTA
        zigbeeOutletOTA: 7005,  //Zigbee单通道插座­_支持OTA
        zigbeePTemperatureHumiditySensorWithScreen: 7014, //Zigbee-P支持的带屏温湿度传感器
        zigbeeTemperatureControlValveOTA: 7017,     //zigbee温控阀(支持OTA)
        zigbeeTemperatureHumidityIlluminationCurtain: 7023,  //名扬ZigBee3.0温湿度光照蜂巢帘


        //HA网关及其子设备
        haGateway: 20000,   //HA网关
        haSwitch1: 20001,   //HA单通道
        haSwitch2: 20002,   //HA双通道
        haSwitch3: 20003,   //HA三通道
        haSwitch4: 20004,   //HA四通道
        haSwitchLamp: 20005,   //HA开关灯
        haDimmingLamp: 20006,   //HA调光灯
        ha2Lamp: 20007,   //HA双色灯
        ha5Lamp: 20008,   //HA五色灯

        //matter标准协议设备(参考csa官方文档的：Device-Library-Specification)
        matterOnOffPluginUnit: 30000, // matter标准协议中的0x010A类型(On/Off Plug-in Unit)设备
        matterExtendedColorLight: 30001, // matter标准协议中的0x010D类型(Extended Color Light)设备
        matterAggregator: 30002, // matter标准协议中的0x000E类型(Aggregator)设备
        matterOnOffLightSwitch: 30003, // matter标准协议中的0x0103类型(On/Off Light Switch)设备
        matterColorTemperatureLight: 30004, // matter标准协议中的0x010C类型(Color Temperature Light)设备
        // UIID 30005 和 30006 参考 tower https://tower.im/teams/643784/todos/69027/
        matterTemperatureHumiditySensor: 30005, // Matter 温湿度传感器
        matterContactSensor: 30006, // Matter 接触传感器
    },
};
