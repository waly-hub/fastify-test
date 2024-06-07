const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'cms_post_approve';
const schema = new Schema({
    approveId: { type: String, required: true },  //点赞id
    count: { type: Number, required: true },  //点赞数
    updatedAt: { type: Date, required: true },  //记录更新时间
    createdAt: { type: Date, required: true },  //记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
