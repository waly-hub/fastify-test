const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'activity_config';

const schema = new Schema({
    id: { type: String, required: true },           // 活动id,格式：YYYYMMDD_序号，序号长度4位，从0001开始，日期不同时序号重置
    appid: { type: String, required: true },        // 活动开展的平台
    publicStartAt: { type: Date, required: true },  // 活动入口开放的开始时间
    publicEndAt: { type: Date },                    // 活动入口开放的结束时间
    startAt: { type: Date, required: true },        // 活动开始时间
    endAt: { type: Date },                          // 活动结束时间
    partner: { type: Array, default: undefined },   // 活动合作方
    title: { type: String, required: true },        // 活动标题
    copywriting: { type: Object },                  // 活动文案内容，不规定对象的数据结构，由服务端与客户端协商
    updatedAt: { type: Date, required: true },      // 记录更新时间
    createdAt: { type: Date, required: true },      // 记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};