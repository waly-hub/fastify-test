const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'purchase_orders';
const schema = new Schema({
    apikey: { type: String, required: true },  //用户apikey
    recordCode: { type: String, required: true },  //用于按用户+商品分组查询订单历史，格式：{用户apikey}.{商品分组名称}
    subsCode: { type: String },  //用于订阅订单升降级查询，同一个subsCode的订单允许升降级，格式：{用户apikey}.{购买平台}.{商品分组}
    appName: { type: String, required: true }, //应用名
    sku: { type: String, required: true },  //商品sku
    orderId: { type: String, required: true },  //订单号
    platform: { type: String, required: true },  //购买平台
    currency: { type: String },  //购买时的币种
    price: { type: String },  //购买价格
    priceAmount: { type: String },    //不带货币符号的价格，目前苹果使用
    state: { type: Number },  //订单状态
    extra: { type: Schema.Types.Mixed },  //订单的额外信息
    //platform为google时有该字段
    googleOrder: {
        token: { type: String },
        subscribe: {  //购买类型是订阅时有该字段
            state: { type: Number },  //订阅状态
            eventDate: { type: Date },  //最后一次事件通知的时间
            updatedAt: { type: Date },  //状态更新时间
            expiredAt: { type: Date },  //订阅到期时间

            //这两个字段涉及到计算订阅商品的过期时间
            firstDate: { type: Date },  //第一次订阅订单到达服务端的时间
            times: { type: Number },  //第几次续订
        },
    },

    // 增加字段时不能加 required，会导致 googleOrder 订单写不进去
    appleOrder: {
        receiptPath: { type: String },   //当时所用 AppleID 的 receipt 文件在 S3 的路径
        originalTransactionId: { type: String },
        subscribe: {    //购买的是自动或非自动续订的订阅时有该字段
            state: { type: Number },        //订阅状态
            renewInfo: {
                autoRenewProductId: { type: String },  // 下一个续订计划的商品ID
                status: { type: Number },   //续订状态
                updatedAt: { type: Date },  //续订状态更新时间
            },

            // 以下两个字段涉及增值时间计算
            firstDate: { type: Date },
            times: { type: Number },
        },
        purchasedAt: { type: Date }, //订阅支付时间
        expiredAt: { type: Date },  //如果是订阅，有到期时间字段
        canceledAt: { type: Date },     //退款时间
        cancellationReason: { type: String },     //过期理由
        promotionCode: { type: Array, default: undefined },    // 优惠码数组
    },

    wechatOrder: {
        from: { type: String },     // 生成微信支付订单的渠道, miniProgram
        purchasedAt: { type: Date },
        preOrderId: { type: String },       // 预订单号
        promotionCode: { type: Array, default: undefined },
    },

    vipWebStoreOrder: {
        purchasedAt: { type: Date },
        paymentId: { type: String },
        promotionCode: { type: Array, default: undefined },
    },

    youzanStoreOrder: {
        purchasedAt: { type: Date },
        paymentId: { type: String },
        promotionCode: { type: Array, default: undefined },
    },

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
 * { apikey: 1 }
 * { orderId: 1 }  unique
 * { recordCode: 1, createdAt: 1 }
 * { subsCode: 1, createdAt: 1 }
 * { "googleOrder.token": 1, createdAt: 1 }
 * { "recordCode": 1, "appleOrder.purchasedAt": 1 }
 * { "subsCode": 1, "appleOrder.purchasedAt": 1 }
 */
