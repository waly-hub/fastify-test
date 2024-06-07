/**
 * 固件发布信息表
 * 存储iotgo 新版ota后台（23年Q4的新版）中创建的固件发布信息（真实用户根据该表获取到版本）
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionName = 'device_firmware_releases';
const schema = new Schema({
    fwModel: { type: String, required: true }, // 固件模组型号
    /**
     * 固件产品型号，新版ota系统中支持将固件拆至产品型号维度创建版本，但默认是模组型号维度。
     * 如果一个固件按照产品型号维度拆分则后续必须按照产品型号维度去创建版本。
     */
    productModel: { type: String }, 
    version: { type: String, required: true }, // 发布版本号，格式为三个数字，以「.」来分隔。示例：1.0.12
    desc: { type: String }, // 发布描述（升级文案，可以是文案内容，也可以是一个CMS链接）
    firmwareId: { type: mongoose.Types.ObjectId, required: true }, // 固件id，索引到唯一的一条固件版本记录。
    isCriticalVersion: { type: Boolean }, // 是否为关键版本，若是关键版本则固件升级的路径必须先把未升级的关键版本升级完成，再升级至最新版。
    visibleVersion: { type: Array }, // 可见版本列表，若该字段存在则本发布版本仅对当前处于特定发布版本的设备可见。例如列表设为 [1.2.0, 1.3.0]，则当前设备处于这两个版本时才可升级到本版本
    whitelistRule: { type: Object }, // 白名单规则，白名单功能常用与在正式发布前供测试人员进行测试。
    blacklistRule: { type: Object }, // 黑名单规则，黑名单功能一般不常用，按需求屏蔽指定设备
    grayRule: { type: Object }, // 灰度规则
    meta: { type: Object }, // 元数据，保存更新记录列表，元素包括更新人，更新时间，更新人所属公司等信息。由前端透传给服务端存储。
    /**
     * 发布状态：测试中：testing - 测试阶段每次去数据库拉全量表查询
     * 正式发布：published - 正式阶段可以延迟生效（待定）
     * 暂停发布：paused
     * 停止发布：stopped
     */
    status: { type: String }, 
    updatedAt: { type: Date }, // 记录最后一次更新的时间
    createdAt: { type: Date }, // 记录创建时间
}, { collection: collectionName });

module.exports = {
    name: collectionName,
    schema: schema,
};
