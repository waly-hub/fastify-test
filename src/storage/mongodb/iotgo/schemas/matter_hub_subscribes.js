/**
 * 维护fabric网络下matter device与matter hub的可达与订阅关系
 * 
 * 表记录存在 subscribed=-1 表示matter设备与matter hub可达但不可订阅
 * 表记录存在 subscribed=0 表示matter设备与matter hub可订阅
 * 表记录存在 subscribed=1 表示matter设备与matter hub可达且已订阅，订阅后matter设备的状态将通过该hub转发给长连接服务器
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'matter_hub_subscribes';
const schema = new Schema({
    matterFabricId: { type: String, required: true }, // matter设备的 fabricId（控制器的fabriceid相同）
    matterNodeId: { type: String, required: true }, // matter设备的 nodeid
    matterHubNodeId: { type: String, required: true }, // matter hub控制器的nodeid(NSPanel Pro)
    deviceId: { type: String },  // matter设备的deviceid
    hubDeviceId: { type: String }, // 控制器（matter hub)的deviceid
    subscribed: { type: Number }, // 1 已订阅、0可达未订阅、-1不可订阅，一般是网关处于离线状态
    updatedAt: { type: Date }, // 记录最后一次更新的时间
    createdAt: { type: Date }, // 记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};