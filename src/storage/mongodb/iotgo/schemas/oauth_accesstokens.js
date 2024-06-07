const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'oauth_accesstokens';
const schema = new Schema({
    accessToken: { type: String, required: true, unique: true }, 
    clientId: String, // 客户端标识，一般为appid
    endpointId: { type: String }, // 登录端标识，由发起登录的客户端传递
    uid: { type: String, required: true }, // 用户标识一般为用户apikey
    expires: Date,
    // 客户端信息
    client: {
        platform: { type: String },
        app: { type: String },
        deviceName: { type: String },
    },
}, { collection: collectionName });


module.exports = {
    name: collectionName,
    schema: schema,
};

