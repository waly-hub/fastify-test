const { bleVirtualDeviceSetting } = require('./constant');

const storage = require('./storage_service').get();
const { iotgo } = storage.mongodb;

const uisModel = iotgo.getCollection('uis');
const modelModel = iotgo.getCollection('models');
const brandsModel = iotgo.getCollection('brands');
const bleConfigModel = iotgo.getCollection('ble_config');
const modelInfosModel = iotgo.getCollection('modelinfos');
const oauthClientModel = iotgo.getCollection('oauth_clients');
const manufacturerModel = iotgo.getCollection('manufacturers');
const oauthRoleConfigsModel = iotgo.getCollection('oauth_role_configs');

//Dao
const modelDao = require('../dao/mongo/iotgo/models');

const oauthConfigsMap = new Map();
const roleSettingsMap = new Map();
const appidConfigsMap = new Map();
const modelInfosMap = new Map();
const brandInfosMap = new Map();
const uisInfosMap = new Map();
const modelsMap = new Map();
const bleConfigMap = new Map();
const manufacturerMap = new Map();

const appConfigDao = require('../dao/mongo/iotgo/appid_configs');


/**
 * 获取app的一些配置项（主要是签名校验等）
 * @param {String} appID 
 */
async function getAppSettings(appID, useCache = true) {
    //map初始化
    let settings;
    if (useCache) {
        settings = oauthConfigsMap.get(appID);
        if (!settings) {
            settings = await oauthClientModel.findOne({ clientId: appID }).lean();
            if (!settings) {
                //没有找到
                settings = -1;
            }
            oauthConfigsMap.set(appID, settings);
        }
    } else {
        settings = await oauthClientModel.findOne({ clientId: appID }).lean();
        if (!settings) {
            //没有找到
            settings = -1;
        }
    }
    oauthConfigsMap.set(appID, settings);
    if (settings === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }

    return settings;
}

/**
 * 获取客户端角色的配置
 * @param {String} roleID 
 */
async function getRoleSettings(roleID) {
    //map初始化
    let settings = roleSettingsMap.get(roleID);
    if (!settings) {
        settings = await oauthRoleConfigsModel.findById(roleID).lean();
        if (!settings) {
            //没有找到
            settings = -1;
        }
        roleSettingsMap.set(roleID, settings);
    }
    if (settings === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }
    return settings;
}

/**
 * 获取app的一些配置项（主要是推送，邮件，短信等）
 * @param {String} appid 
 */
async function getAppConfigs(appid) {
    //map初始化
    let configs = appidConfigsMap.get(appid);
    if (!configs) {
        configs = await appConfigDao.getAppConfigByAppid(appid);
        if (!configs) {
            //没有找到
            configs = -1;
        }
        appidConfigsMap.set(appid, configs);
    }
    if (configs === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }

    return configs;
}



/**
 * 获取指定模块型号信息
 * @param {String} modelInfoID 
 */
async function getModelInfos(modelInfoID) {
    //map初始化
    let modelInfos = modelInfosMap.get(modelInfoID);
    if (!modelInfos) {
        modelInfos = await modelInfosModel.findById(modelInfoID).lean();
        if (!modelInfos) {
            //没有找到
            modelInfos = -1;
        }
        modelInfosMap.set(modelInfoID, modelInfos);
    }
    if (modelInfos === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }

    return modelInfos;
}

/**
 * 获取品牌信息
 * @param {String} brandID 
 */
async function getBrandInfos(brandID) {
    //map初始化
    let brandInfos = brandInfosMap.get(brandID);
    if (!brandInfos) {
        brandInfos = await brandsModel.findById(brandID).lean();
        if (!brandInfos) {
            //没有找到
            brandInfos = -1;
        }
        brandInfosMap.set(brandID, brandInfos);
    }
    if (brandInfos === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }

    return brandInfos;
}

/**
 * 获取UIID信息
 * @param {String} uiid 
 */
async function getUisInfos(uiid) {
    //map初始化
    let uisInfos = uisInfosMap.get(uiid);
    if (!uisInfos) {
        uisInfos = await uisModel.findOne({ uiid: uiid }).lean();
        if (!uisInfos) {
            //没有找到
            uisInfos = -1;
        }
        uisInfosMap.set(uiid, uisInfos);
    }
    if (uisInfos === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }
    return uisInfos;
}

/**
 * 获取models信息
 * @param {String} model 
 */
async function getModels(model) {
    //map初始化
    let models = modelsMap.get(model);
    if (!models) {
        models = await modelDao.getModelByName(model);
        if (!models) {
            //没有找到
            models = -1;
        }
        modelsMap.set(model, models);
    }
    if (models === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }
    return models;
}

/**
 * 获取轻智能设备协议信息
 * @param {String} protocol 协议代号 
 */
async function getBleConfig(protocol) {
    //map初始化
    let bleConfig = bleConfigMap.get(protocol);
    if (!bleConfig) {
        bleConfig = await bleConfigModel.findOne({ protocol }).lean();
        if (!bleConfig) {
            //没有找到
            bleConfig = -1;
        }
        bleConfigMap.set(protocol, bleConfig);
    }
    if (bleConfig === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }
    return bleConfig;
}

/**
 * 获取轻智能设备的uiid集合
 */
async function getVirtualBleDeviceUiidSet() {
    const virtualBleDeviceUiidSet = new Set();
    const protocolCodes = Object.values(bleVirtualDeviceSetting.protocolCode);
    for (const protocolCode of protocolCodes) {
        const bleConfig = await getBleConfig(protocolCode);
        const allowList = bleConfig?.allowList;
        if (!allowList) {
            continue;
        }

        for (const item of allowList) {
            const supportUIIDs = item.supportUIIDs;
            for (const uiid of supportUIIDs) {
                virtualBleDeviceUiidSet.add(uiid);
            }

        }
    }
    return virtualBleDeviceUiidSet;
}

/**
 * 获取zigbee子设备uiid集合
 * @returns {Set<number>}
 */
async function getZigbeeSubDeviceUiidSet() {
    const uiidSet = new Set();
    const zigbeeInfo = await modelModel.findOne({ model: 'zigbee' }).lean();
    if (zigbeeInfo && zigbeeInfo.ui) {
        for (const item of zigbeeInfo.ui) {
            uiidSet.add(parseInt(item));
        }
    }
    return uiidSet;
}

/**
 * 获取厂商信息
 * @param {String} manuId 
 */
async function getManufacturer(manuId) {
    //map初始化
    let manufacturer = manufacturerMap.get(manuId);
    if (!manufacturer) {
        manufacturer = await manufacturerModel.findById(manuId).lean();
        if (!manufacturer) {
            //没有找到
            manufacturer = -1;
        }
        manufacturerMap.set(manuId, manufacturer);
    }
    if (manufacturer === -1) {
        //-1表示之前已经在数据库查找过了，但没有找到
        return null;
    }
    return manufacturer;
}




module.exports = {
    getAppSettings,
    getRoleSettings,
    getAppConfigs,
    getModelInfos,
    getBrandInfos,
    getUisInfos,
    getModels,
    getBleConfig,
    getVirtualBleDeviceUiidSet,
    getZigbeeSubDeviceUiidSet,
    getManufacturer,
};