const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_client_infos';
const schema = new Schema({
    _id: { type: String },// 主键,格式为apikey
    wxClientInfos: [new Schema({
        wxAppid: { type: String },
        openid: { type: String },
        unionid: { type: String },
        nickname: { type: String },
        avatarUrl: { type: String },
        hasAvatarUrl: { type: Boolean },
        createdAt: { type: Date, default: Date.now },
    }, { _id: false })],
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

/**
 * 索引为
 * db.user_platform.createIndex(
   {"wxClientInfos.wxAppid": 1 "wxClientInfos.openid": 1},
   { partialFilterExpression: {"wxClientInfos.wxAppid":{ $exists:true }}}
)
 */
