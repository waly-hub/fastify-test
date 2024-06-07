const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'families';
const schema = new Schema({
    apikey: { type: String, required: true }, //用户apikey
    name: { type: String, required: true }, //家庭名称
    index: { type: Number }, //排序顺序
    rooms: [ //房间
        new Schema({
            name: { type: String, required: true }, //房间名称
            index: { type: Number }, //房间排序顺序
        }),
    ],
    shareUsersInfo: [new Schema({
        apikey: { type: String, required: true },//被分享方apikey
        comment: { type: String },//分享的备注
        shareDate: { type: Date, required: true },//分享时间
        platform: { type: String, required: true },//分享平台
        expiredAt: { type: Date },  //过期时间
    }, { _id: false })],
    createdAt: { type: Date, required: true },  //创建时间
    updatedAt: { type: Date, required: true },  //修改时间
    extList: { type: Schema.Types.Mixed },      //记录手表内需要显示的东西
    currentRhythmGroup: { type: Schema.Types.ObjectId },     //家庭当前的律动组
    smartCenter: {  //智能中心数据
        sensor: {
            tempSource: { type: String },
            humSource: { type: String },
            index: { type: Number },
            hidden: { type: Boolean },
        },
        demPanel: {
            groupId: { type: String },
            index: { type: Number },
            hidden: { type: Boolean },
        },
        deviceUsage: {
            index: { type: Number },
            hidden: { type: Boolean },
            hiddenDevices: [
                new Schema({
                    id: {type: String},
                }, {_id: false}),
            ],
        },
        presenceSimulation: {
            index: { type: Number },
            hidden: { type: Boolean },
        },
        cameraPanel: {
            index: { type: Number },
            hidden: { type: Boolean },
        },
        cameras: {type: Array, default: []},
    },
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};

