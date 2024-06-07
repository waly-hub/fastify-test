const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//v2版苹果全球订单表

const collectionName = 'apple_orders_global_v2';
const schema = new Schema({
    appName: { type: String, required: true },                  //app包名
    orderId: { type: String, required: true },                  //服务端记录的订单号
    originalTransactionId: { type: String, required: true },    //苹果首笔交易的id
    environment: { type: String, required: true },              //订单环境
    sku: { type: String, required: true },                      //购买的商品sku
    paymentStatus: { type: String, required: true },            //支付状态
    purchaseReason: { type: String, required: true },           //购买原因
    platformOrderExtraInfo: { type: Object, default: {} },      //平台订单的额外信息
    purchaseDate: { type: Date, required: true },               //购买时间
    expiresDate: { type: Date },                                //过期时间
    revocationDate: { type: Date },                             //退款时间
    region: { type: String },                                   //买家所在区域
    apikey: { type: String },                                   //买家的apikey
    extraInfo: { type: Object, default: {} },                   //买家的额外信息
}, { collection: collectionName, timestamps: true });

module.exports = {
    name: collectionName,
    schema: schema,
};


/**
 * 索引配置
 * 
 * { orderId: 1 }  unique
 * { originalTransactionId: 1, purchaseDate: -1 }
 * { "platformOrderExtraInfo.subsStartOrderId": 1 }
 */