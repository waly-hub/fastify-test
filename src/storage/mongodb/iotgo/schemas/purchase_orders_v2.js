const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//v2版苹果本地订单表

const collectionName = 'purchase_orders_v2';
const schema = new Schema({
    orderId: { type: String, required: true },          //服务端记录的订单号
    appName: { type: String, required: true },          //应用包名
    platform: { type: String, required: true },         //购买平台
    environment: { type: String, required: true },      //订单环境
    sku: { type: String, required: true },              //购买的商品sku
    currency: { type: String },                         //商品币种
    price: { type: String },                            //商品价格
    paymentStatus: { type: String, required: true },    //支付状态
    purchaseReason: { type: String, required: true },   //购买原因
    platformOrderExtraInfo: { type: Object, default: {} },     //平台订单的额外信息
    purchaseDate: { type: Date, required: true },       //购买时间
    expiresDate: { type: Date },                        //过期时间
    revocationDate: { type: Date },                     //退款时间
    apikey: { type: String, required: true },           //买家的apikey
    extraInfo: { type: Object, default: {} },           //买家的额外信息
    subscribeCode: { type: String },                    //买家订阅代码
}, { collection: collectionName, timestamps: true });

module.exports = {
    name: collectionName,
    schema: schema,
};
