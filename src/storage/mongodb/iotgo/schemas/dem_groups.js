const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'dem_groups';
const schema = new Schema({
    apikey: { type: String },
    name: { type: String },
    alarm: {
        switch: { type: Boolean },
        weekVal: { type: Number },
        monthVal: { type: Number },
    },
    associatedDeviceid: { type: String }, //关联了哪个设备
    devices: { type: Array, default: undefined },
    nextCheckTime: { type: Date },
    updateTime: { type: Date },
    weekAlarmTime: { type: Date },
    monthAlarmTime: { Type: Date },
    createTime: { type: Date },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};