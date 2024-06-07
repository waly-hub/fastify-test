const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_rhythm_groups';
const schema = new Schema({
    familyId: { type: Schema.Types.ObjectId, required: true },          //律动组所在家庭
    apikey: { type: String, required: true },                           //家庭主人apikey
    name: { type: String, required: true },                             //律动组名
    deviceList: [new Schema({
        deviceid: { type: String, required: true },
    }, { _id: false })],                                               //组内律动设备的设备列表
}, { collection: collectionName, timestamps: true });

/**
 * 索引
 * { familyId: 1, createdAt: 1 }
 * { deviceList.deviceid: 1, familyId: 1 }
 */

module.exports = {
    name: collectionName,
    schema: schema,
};
