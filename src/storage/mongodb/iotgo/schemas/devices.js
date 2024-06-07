const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'devices';
const schema = new Schema({
    name: { type: String, required: true },
    group: { type: String, default: '' },
    type: { type: String, required: true, index: true, match: /^[0-9a-f]{2}$/ },
    deviceid: { type: String, required: true, index: true, match: /^[0-9a-f]{10}$/ },
    apikey: { type: String, required: true, index: true },
    createdAt: { type: Date, index: true, default: Date.now },
    online: { type: Boolean, index: true, default: false },
    deviceStatus: { type: String, index: true },
    params: { type: Schema.Types.Mixed, default: {} },
    extra: { type: Schema.Types.ObjectId },
    shareUsers: [Schema.Types.Mixed],
    groups: [String],   //设备分组
    devGroups: [Schema.Types.Mixed],
    tags: { type: Object },
    settings: {
        opsNotify: { type: Number },
        opsHistory: { type: Number },
        alarmNotify: { type: Number },
        wxAlarmNotify: { type: Number },
        wxOpsNotify: { type: Number },
        wxDoorbellNotify: { type: Number },
        appDoorbellNotify: { type: Number },
        doorOnNotify: { type: Number },
        doorOffNotify: { type: Number },
        wxDoorOffNotify: { type: Number },
        wxDoorOnNotify: { type: Number },
        removeNotify: { type: Number },
        wxRemoveNotify: { type: Number },
        moveNotify: { type: Number },
        wxMoveNotify: { type: Number },
        lightNotify: { type: Number },
        wxLightNotify: { type: Number },
        overheatNotify: { type: Number },
        keyboardNotify: { type: Number },
        armOnNotify: { type: Number },
        armOffNotify: { type: Number },
        wxArmOnNotify: { type: Number },
        wxArmOffNotify: { type: Number },
        temperatureNotify: { type: Number },
        minTemperature: { type: Number },
        maxTemperature: { type: Number },
        humidityNotify: { type: Number },
        minHumidity: { type: Number },
        maxHumidity: { type: Number },
        webOpsNotify: { type: Number },
        wxSubscriptionNotify: { type: Number },
        wxLowBatteryNotify: { type: Number },
        powerFailureNotify: { type: Number },
        wxPowerFailureNotify: { type: Number },
        wxSubscriptionDoorOnNotify: { type: Number },
        //wxSubscriptionDoorOffNotify: { type: Number },
        powerConsumptionNotify: { type: Number },
        dailyKwh: { type: Number },
        monthlyKwh: { type: Number },
        cameraMotionDetectionNotify: { type: Number },
        cameraSoundDetectionNotify: { type: Number },
        cameraEventDetectionNotify: { type: Number },
        cameraShadeDetectionNotify: { type: Number },
        offlineNotify: { type: Number },
        lowBatteryNotify: { type: Number },
        wxSubscriptionTemperatureNotify: { type: Number },
        wxSubscriptionHumidityNotify: { type: Number },
        overThresholdNotify: { type: Number },
        cameraHumanoidDetectionNotify: { type: Number },
        doorOnFailNotify: { type: Number },
        doorOffFailNotify: { type: Number },
        doorOnTimeoutNotify: { type: Number },
        waterValveExceptionNotify: { type: Number },
    },
    onlineTime: { type: Date },
    family: {
        id: { type: mongoose.Types.ObjectId, required: true },
        index: { type: Number, required: true },
        room: {
            id: { type: mongoose.Types.ObjectId },
        },
        members: [{ type: String }],
        guests: [new Schema({
            apikey: { type: String },
            expiredAt: { type: Date },
        }, { _id: false })],
    },
    shareUsersInfo: [new Schema({
        apikey: { type: String, required: true },
        permit: { type: Number, required: true },
        family: {
            id: { type: mongoose.Types.ObjectId, required: true },
            index: { type: Number, required: true },
            room: {
                id: { type: mongoose.Types.ObjectId },
            },
        },
        comment: { type: String },
        shareDate: { type: Date, required: true },
        platform: { type: String, required: true },
        expiredAt: { type: Date },
        authority: {
            updateTimers: { type: Boolean },
        },
    }, { _id: false })],
    newApp: { type: Number },
    relational: [{ type: Object }],
    extraNotify: {
        thirdparty: { type: Boolean },
    },
    matterFabricId: { type: String },
    matterNodeId: { type: String },
    subscribeMatterHubId: { type: String },
}, { collection: collectionName, minimize: false });

module.exports = {
    name: collectionName,
    schema: schema,
};
