const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'user_scenes';
const schema = new Schema({
    name: { type: String, required: true, index: false },
    apikey: { type: String, required: true, index: false },
    condition: { type: String, required: true, index: false },
    operations: [Schema.Types.Mixed],
    createdAt: { type: Date },
    updateAt: { type: Date },
    keepState: { type: Boolean, index: true },
    time_ranges: [
        {
            rang_id: { type: String },
            rangeName: { type: String },
            week: [Number],
            startHour: { type: Number },
            endHour: { type: Number },
            startMin: { type: Number },
            endMin: { type: Number },
            zone: { type: Number },
            type: { type: Number },
            expressions: [String],
        },
    ],
    family: {
        id: { type: mongoose.Types.ObjectId, required: true },
        index: { type: Number },
    },
    iconIndex: { type: Number },
    disable: { type: Boolean, default: false },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
