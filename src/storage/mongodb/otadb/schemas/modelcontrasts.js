const mongoose = require('mongoose');
/**
 * Created by gavin on 15-10-14.
 *
 * 异常日志 mongo操作
 */

const Schema = mongoose.Schema;

const versionSchenma = new Schema({
    versionNum: { type: String, index: true },
    versionCode: { type: Number, index: true },
});

const schema = new Schema({
    model: { type: String, index: true },  //模块型号
    versionInfo: [versionSchenma], // 版本号 版本升级信息
});

module.exports = {
    name: 'modelcontrasts',
    schema: schema,
};
