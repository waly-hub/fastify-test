const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'apple_orders_global';
const schema = new Schema({
    appName: { type: String, required: true },                  // app 名称
    orderId: { type: String, required: true },                  // 订单号，唯一索引，格式： {orignalTransactionId + purchaseDateMs}
    originalTransactionId: { type: String, required: true },    // 苹果原始订单号
    productId: { type: String, required: true },                // 商品 ID
    recordCode: { type: String },                               // 用于按用户+商品分组查询订单历史，格式：{用户区域}.{用户apikey}.{商品分组名称}
    region: { type: String },                                   // 区域
    apikey: { type: String },                                   // 用户 apikey
    extra: { type: Schema.Types.Mixed },                        // 订单的额外信息
    subscription: {                                             // 如果是自动订阅订单就有这个字段
        startOrderId: { type: String },                         // 本轮订阅开始的订单号
        prevOrderId: { type: String },                          // 本次订阅的上一张订阅订单号
        type: { type: Number },                                 // 表示订单是购买订单还是续订订单
        renewInfo: {
            autoRenewProductId: { type: String },               // 下一个续订计划的商品ID
            status: { type: Number },                           // 表示订阅的续订状态 1=续订中 0=不续订
            updatedAt: { type: Date },                           // 续订状态最后一次更新的时间
        },
        // 以下两个字段涉及增值时间计算
        firstDate: { type: Date },
        times: { type: Number },
    },
    isFreeTrial: { type: Boolean },                         // 是否是免费试用订单，true=是
    purchasedAt: { type: Date, required: true },            // 订单购买时间
    expiredAt: { type: Date },                              // 如果是订阅，会有过期时间字段 
    canceledAt: { type: Date },                 //退款时间
    cancellationReason: { type: String },       //过期理由
    updatedAt: { type: Date, required: true },  //记录更新时间
    createdAt: { type: Date, required: true },  //记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};


/**
 * 索引配置
 * 
 * { orderId: 1 }  unique
 * { "recordCode": 1, "purchasedAt": 1 }
 * { "orignalTransactionId": 1, "purchasedAt": 1 }
 * { "subscription.startOrderId": 1 }
 */