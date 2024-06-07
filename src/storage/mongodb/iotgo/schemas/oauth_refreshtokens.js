const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'oauth_refreshtokens';
const schema = new Schema({
    refreshToken: { type: String, required: true, unique: true },
    clientId: String, // 客户端标识，一般为appid
    endpointId: { type: String }, // 登录端标识，由发起登录的客户端传递
    uid: { type: String, required: true }, // 用户标识一般为用户apikey
    expires: Date,
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
