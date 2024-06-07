const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'wrong_mail_domains';
const schema = new Schema({
    email: {
        type: String, required: true, index: true, unique: true,
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
