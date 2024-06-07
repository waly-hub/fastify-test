//该schema只用于【检查定时器定时器任务】中只读数据，所以定义为{}。
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_timers';
const schema = new Schema({}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};