const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'oauth_role_configs';
const schema = new Schema({
    rolename: { type: String, required: true },
    resources: [String],  //权限资源点
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

