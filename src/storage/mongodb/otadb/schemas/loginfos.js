const mongoose = require('mongoose');
/**
 * Created by gavin on 15-10-14.
 *
 * 异常日志 mongo操作
 */

const Schema = mongoose.Schema;
const schema = new Schema({
    username: String,    //上传账号
    userAgent: String,   //手机信息
    logPath: String,     //日志路径
    createdAt: String,    //服务器 创建事件
    appid: String,
    version: String,
    ts: String,
    nonce: String,
    model: String,
    os: String,
    imei: String,
    romVersion: String,
    apkVersion: String,
    title: String,
    content: String,
});
module.exports = {
    name: 'loginfos',
    schema: schema,
};
