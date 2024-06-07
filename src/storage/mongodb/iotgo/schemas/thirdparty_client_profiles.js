const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'thirdparty_client_profiles';
const schema = new Schema({
    platform: { type: String, required: true },
    clientid: { type: String, index: true, required: true },
    clientSecret: { type: String, default: 'coolkit' },
    thirdpartyClientid: { type: String, default: '' },
    thirdpartySecret: { type: String, default: '' },
    clientScope: { type: String, default: '' },
    thirdpartyScope: { type: String, default: '' },
    extend: { type: Object, default: {} },
});


module.exports = {
    name: collectionName,
    schema: schema,
};