/**
 * alexa-支持ASE的设备表
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'alexa_smart_energy_devices';
const schema = new Schema({
    apikey: { type: String, required: true }, // 用户apikey
    deviceid: { type: String, required: true }, // 设备标识
    productName: { type: String }, // 设备产品型号
    defaultResolution: { type: Number }, // 设备每次数据采样的默认时间间隔
    reportResolution: { type: Number },// 实际采样间隔
    reportStartTs: { type: Date }, // 记录下次上报的起始测量时间戳。
    retryTimes: { type: Number }, // 重试次数
    calculatedPower: { type: Number }, // 已统计的电量值
    revertResolutionTs: { type: Date }, // 记录恢复实际采样频率（reportResolution）为原有的默认频率（defaultResolution）的时间戳
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};