const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_globals';
const schema = new Schema({
    accountDigest: { type: String, required: true, index: true, unique: true },
    region: { type: String, required: true },  // cn,eu,us
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};