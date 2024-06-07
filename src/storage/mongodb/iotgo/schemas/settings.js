const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'settings';
const schema = new Schema({
    deviceid: { min: Number, max: Number, current: Number },
    newDeviceid: { min: Number, max: Number, current: Number },
    mac: { min: Number, max: Number, current: Number },
    type: { type: String },
    area: [{ type: Object }],
    model: [{ type: String }],
    ui: [{ type: String }],
    nestDeviceid: { min: Number, max: Number, current: Number },
    manufacturer: [{ type: String }],
    partnerDeviceid: { min: Number, max: Number, current: Number },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

