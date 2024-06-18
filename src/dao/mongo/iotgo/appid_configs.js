const storage = require('../../../utils/storage_service').get();

const appidConfigModel = storage.mongodb.iotgo.getCollection('appid_configs');


/**
 * 通过appid获取App配置
 * @param {String} appid - App 的 appid
 * @return {Promise<AppidConfig|null>}
 */
function getAppConfigByAppid(appid) {
    return appidConfigModel.findOne({ appid }).lean();
}

async function updateAppConfig(condition, update) {
    return await appidConfigModel.findOneAndUpdate(condition, update, { new: true }).lean();
}

module.exports = {
    getAppConfigByAppid,
    updateAppConfig,
};

/**
 * @typedef AppidConfig
 * @property {string} appid - 应用id
 * @property {string} appSecret - 应用密钥
 * @property {object} [appleServiceAccount] - 苹果服务账号
 * @property {object} appleServiceAccount.iap - 内购
 * @property {string} appleServiceAccount.iap.iss - issuer id
 * @property {string} appleServiceAccount.iap.bundleId - 包名
 * @property {string} appleServiceAccount.iap.privateKeyId - 密钥id
 * @property {string} appleServiceAccount.iap.privateKey - 密钥
 */