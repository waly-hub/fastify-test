const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'manufacturers';
const schema = new Schema({
    name: { type: String },
    desc: { type: String },
    address: { type: String },
    brands: [Schema.Types.ObjectId],
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

