const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'activate_devices';
// activate_devices 表结构的参考文档：https://itead.yuque.com/nfgzbt/dmsqx8/gn5k61bhf32oa86k
const schema = new Schema({
    _id: { type: String, required: true },              // 唯一标识 ID
    activatedAt: { type: Date, required: true },        // 设备激活时间
    activatedBy: { type: String, required: true },      // 设备所属用户的 apikey
    activateType: { type: Number, required: true },     // 激活设备的类型
    matterDevInfo: {
        vid: { type: Number, required: true },          // Matter 设备的厂商 ID
        pid: { type: Number, required: true },          // Matter 设备的标识 ID
        deviceTypeId: { type: Number, required: true }, // Matter 设备类别代码
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
