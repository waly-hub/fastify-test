const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'group_infos';
const schema = new Schema({
    uid: { type: String, index: true, required: true },  //用户apikey
    name: { type: String, index: true }, //名称
    index: { type: Number },  //排序顺序
    createdAt: { type: Date, index: true, default: Date.now },
    groupParams: { type: Schema.Types.Mixed },
    groupType: { type: Number, index: true, default: 0 },//根据用户表可以区分，但还是添加一个字段标注一下。type：0，分组，type:1群组。
    mainDeviceId: { type: String, index: true },
    family: {
        id: { type: mongoose.Types.ObjectId, required: true },
        index: { type: Number, required: true },
        room: {
            id: { type: mongoose.Types.ObjectId },
        },
        members: [{ type: String }],
        guests: [new Schema({//访客时是改这个字段
            apikey: { type: String },
            expiredAt: { type: Date },
        }, { _id: false })],
    },
    associatedZbGroups: [{ type: Object }], // 关联的zb群组的信息
    relational: [{ type: Object }],
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

