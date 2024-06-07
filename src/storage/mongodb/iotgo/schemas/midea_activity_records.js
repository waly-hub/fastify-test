
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'midea_activity_records';
const schema = new Schema({
    activityId: { type: String, require: true }, // 活动id
    apikey: { type: String, required: true },//用户apikey
    condition: [{
        id: { type: Number, required: true }, // 活动条件序号
        finishTimestamp: { type: Number }, // 完成活动的时间戳，单位毫秒;
    }],
    createTimestamp: { type: Number, require: true }, // 创建记录时间
    finishTimestamp: { type: Number }, // 活动完成时间，这里指领取奖励时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};