/**
 * 固件版本信息表
 * 存储iotgo 新版ota后台（23年Q4的新版）中创建的固件版本信息
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_firmware_versions';
const schema = new Schema({
    fwModel: { type: String, required: true }, // 固件模组型号
    /**
     * 固件产品型号，新版ota系统中支持将固件拆至产品型号维度创建版本，但默认是模组型号维度。
     * 如果一个固件按照产品型号维度拆分则后续必须按照产品型号维度去创建版本。
     */
    productModel: { type: String }, 
    version: { type: String, required: true }, // 固件版本格式为三个数字，以「.」来分隔。示例：1.0.12
    desc: { type: String }, // 版本功能描述。
    fileList: { type: Array }, // 固件文件列表，包含文件的名称和digest信息。元素数量大于等于1
    meta: { type: Object }, // 元数据，保存更新记录列表，元素包括更新人，更新时间，更新人所属公司等信息。由前端透传给服务端存储。
    status: { type: String }, // 当前状态：enable：启用状态，可以创建发布、disable：禁用状态，不能创建发布，但已发布出去的不受该设置影响。
    updatedAt: { type: Date }, // 记录最后一次更新的时间
    createdAt: { type: Date }, // 记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
