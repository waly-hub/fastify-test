const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_rhythm_settings';
const schema = new Schema({
    familyId: { type: mongoose.Types.ObjectId, required: true },        //律动配置所在家庭
    apikey: { type: String, required: true },                           //用户Apikey
    maxBrightness: { type: Number },                    //最大亮度
    sensitivity: { type: String },                      //灵敏度
    scene: new Schema({
        currentScene: { type: String, required: true },                 //当前场景模式：customization=自定义，soft=柔和，strobe=爆闪，rhythm=节奏
        customization: {                                                //自定义的场景设置
            model: { type: String, required: true },
            colorGroups: [new Schema({
                index: { type: Number, required: true },
                rgb: [Schema.Types.Mixed],
            }, { _id: false })],
            currentColorGroup: { type: Number, required: true },         //当前选择的颜色组
        },
    }, { _id: false }),
    lastModifyAt: { type: Date, required: true },                      //客户端本地最后的修改日期
}, { collection: collectionName, timestamps: true });

/**
 * 索引
 * { familyId: 1 }
 */
module.exports = {
    name: collectionName,
    schema: schema,
};
