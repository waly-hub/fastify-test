const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'message_notify_clean';
const schema = new Schema({
    familyid: { type: Schema.Types.ObjectId, required: true },
    beforeAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};