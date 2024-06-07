const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_ext_services';
const schema = new Schema({
    apikey: { type: String, required: true },  //用户apikey
    deviceid: { type: String, required: true },  //设备id
    srvType: { type: String, required: true },  //扩展服务类型
    queryCode: { type: String, required: true },  //查询代码，由"apikey_deviceid_type"组成，便于查询
    startedAt: { type: Date, required: true },  //服务开始时间
    expiredAt: { type: Date, required: true },  //服务过期时间
    oid: { type: Schema.Types.ObjectId },       //购买该服务的订单记录的id（弃用，新记录使用orderId）
    orderId: { type: String },                  //购买该服务的订单号
    srvInfo: { type: Object, default: {} },  //扩展服务信息
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};


/**
 * srvInfo 对象属性里约定的一些通用属性
 * isTrial: Boolean  是否是试用的，true=是
 */