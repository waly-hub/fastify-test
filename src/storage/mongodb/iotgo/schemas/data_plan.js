const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const collectionName = 'data_plan';
const schema = new Schema({
    clientId: { type: String, required: true },
    createdAt: { type: Date },  //创建时间
    startTime: { type: Date },  //流量包起始时间
    endTime: { type: Date },    //创建时间
    effectiveAt: { type: Date },//首次激活时间
    quota: { type: Number, required: true },        //流量包的配额
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
