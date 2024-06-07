const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'ads';
const schema = new Schema({
    manuId: { type: String },  //厂商id
    startTime: { type: Date, required: true }, //广告开始播放时间
    endTime: { type: Date, required: true },  //广告结束时间
    enable: { type: Boolean, required: true },  //True有效，false失效
    createdAt: { type: Date, required: true },  //新增、或者修改广告的时间
    picPath: { type: String, required: true },   //广告的图片地址
    link: { type: String, required: true },      //点击广告的跳转地址
    text: { type: String },    //广告的文字内容，可以为空
    type: { type: Number },  // 0 app广告  1 推送广告
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

