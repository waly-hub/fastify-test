const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'settingpartners';
const schema = new Schema({
    type: { type: String, default: 'partner', required: true, index: true },
    nestDeviceid: { min: Number, max: Number, current: Number },   //nest
    ezvizDeviceid: { min: Number, max: Number, current: Number },  //摄像头
    virDeviceid: { min: Number, max: Number, current: Number },   //富金气象站
    miruiDeviceid: { min: Number, max: Number, current: Number }, //觅睿摄像头
    wifiToInfaredDeviceid: { min: Number, max: Number, current: Number }, //红外设备
    routeDeviceid: { min: Number, max: Number, current: Number }, //路由设备
    shangYunDeviceid: { min: Number, max: Number, current: Number }, //尚云p2p设备
    infaredDeviceid: { min: Number, max: Number, current: Number }, //易微联红外子设备
    ewelinkBleRemoteDeviceid: { min: Number, max: Number, current: Number }, //易微联2.4G蓝牙虚拟设备
    wxdBleRemoteDeviceid: { min: Number, max: Number, current: Number }, //无线到2.4G蓝牙虚拟设备
    duiDieDianBiaoDeviceid: { min: Number, max: Number, current: Number }, //堆叠式电表子设备
    hbwBleRemoteDeviceid: { min: Number, max: Number, current: Number }, //鸿博微2.4G蓝牙虚拟子设备
    eWeLinkRemoteGatewayAppDeviceid: { min: Number, max: Number, current: Number }, //轻智能网关虚拟设备
    mideaDeviceid: { min: Number, max: Number, current: Number }, // 美的美居设备
    penetrateBleRemoteDeviceid: { min: Number, max: Number, current: Number }, //透传协议的2.4G蓝牙虚拟设备
    keyboardDeviceid: { min: Number, max: Number, current: Number }, //keyboard设备
    cameraGatewayDeviceid: { min: Number, max: Number, current: Number }, //摄像头网关
    cameraGatewaySubDeviceDeviceid: { min: Number, max: Number, current: Number }, //摄像头网关子设备
    hueDeviceid: { min: Number, max: Number, current: Number }, //飞利浦设备
    smartthingsDeviceid: { min: Number, max: Number, current: Number }, //三星设备
    haGatewayDeviceid: { min: Number, max: Number, current: Number }, //HA网关
    haGatewaySubDeviceid: { min: Number, max: Number, current: Number }, //HA网关子设备
    yeelightDeviceid: { min: Number, max: Number, current: Number }, //yeelight设备
    googleNestDeviceid: { min: Number, max: Number, current: Number }, //GoogleNest设备
    iHostSubDeviceId: { min: Number, max: Number, current: Number }, //iHost子设备
    castAppDeviceid: { min: Number, max: Number, current: Number }, //cast app设备
    smartMPDeviceId: { min: Number, max: Number, current: Number }, //易微联轻智能小程序设备
    matterDeviceId: { min: Number, max: Number, current: Number }, //matter标准协议接入的设备
    matterSubDeviceId: { min: Number, max: Number, current: Number }, //matter网关的子设备
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

