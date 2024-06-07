const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const binInfo = new Schema({
    name: { type: String, required: true, index: false },
    filePath: { type: String, required: true, index: false },
    digest: { type: String, required: true },
});
const childSchema = new Schema({
    version: { type: String, required: true, index: false, unique: false },
    upgradeText: { type: String, required: false },
    createdAt: { type: Date, index: true, Datedefault: Date.now },
    modifiedAt: { type: Date, index: true, default: Date.now },
    binList: [binInfo],
    status: { type: String, required: false },
    testDeviceids: { type: [String] },
    grayType: { type: Number },
    grayPercentage: { type: Number, default: 100 },
    type: { type: Number, default: 0 },
    forceTime: { type: Date, index: true },
    user1FileName: { type: String },
    user2FileName: { type: String },
    sourceVersion: { type: String },
    useS3: { type: Boolean },
});

const schema = new Schema({
    model: { type: String },
    infoList: [childSchema],

});

module.exports = {
    name: 'upgradeinfos',
    schema: schema,
};
