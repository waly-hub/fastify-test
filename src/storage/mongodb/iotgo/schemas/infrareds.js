const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'infrareds';
const schema = new Schema({
    rid: { type: String, index: true, require: true, unique: true },
    provider: { type: String, index: true },
    libInfo: { type: String },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};