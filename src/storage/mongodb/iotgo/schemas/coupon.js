/**
 * 优惠券表
 * 此表仅保存未发放的优惠券，已发放的优惠券将转存在 elk
 * 表中的数据应保持是可用的，要报废的批次或已过期的券码应在合适的时间移除
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'coupons';
const schema = new Schema({
    code: { type: String, required: true },                                 //优惠券码
    // issuer: { type: String },                                            //优惠券发行方，预留
    batchId: { type: String, required: true },                              //批号，有些优惠券换批时，旧批号优惠券需要作废，格式：YYYYMMDDHHMMSS
    category: { type: String, required: true },                             //类别：优惠券名称
    detail: { type: Schema.Types.Mixed },                                   //优惠券细节，如需要的话
    createdAt: { type: Date, required: true },                              //优惠码创建时间
    expiredAt: { type: Date, default: new Date(2122, 12, 31, 23, 59, 59) }, //优惠码过期时间，没有过期时间就设置为默认值
});

module.exports = {
    name: collectionName,
    schema: schema,
};
