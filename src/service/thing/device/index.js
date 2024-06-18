const crypto = require('crypto');

const {
    errorCode,
    asyncTaskType,
    deviceRelationType,
    relationAsyncNotifyType,
    thingType,
    deviceErrorCode,
    thirdPlatformName,
    sharePlatform,
    lightSmartGatewayUIIDs,
    supportLowFrequencyReportUiidSet,
    matterDeviceTypeMap,
    deviceExtService,
} = require('../../../utils/constant');

/**
 * 获取设备与用户的关系（只需要判断是否是mydevice或者是norelaiton，familyid可以不传）
 * @param {String} apikey
 * @param {Object} deviceInfo
 * @param {String} familyid 如果需要严格检查指定家庭下用户与设备的关系
 * @returns {int}  0:没关系 1:自己的 2:被分享的 5:在分享家庭内的
 */
function getRelationWithDevice(apikey, deviceInfo, familyid) {
    if (!deviceInfo) {
        return thingType.noRelation;
    }
    if (apikey === deviceInfo.apikey) {
        //自己的设备
        return thingType.myDevice;
    }

    const shareInfo = deviceInfo.shareUsersInfo?.find(item => {
        if (item.apikey !== apikey) {
            return false;
        }
        if (item.expiredAt && item.expiredAt.getTime() < Date.now()) {
            //分享过期
            return false;
        }
        return true;
    });
    const isMember = deviceInfo.family?.members?.includes(apikey);
    const isGuest = deviceInfo.family?.guests && deviceInfo.family?.guests?.some(item => item.apikey === apikey && item.expiredAt.getTime() >= Date.now());

    if (!familyid) {
        if (shareInfo) {
            return thingType.shareDevice;
        } else if (isMember || isGuest) {
            //是所在家庭的成员
            return thingType.shareFamilyMyDevice;
        } else {
            return thingType.noRelation;
        }
    } else {
        //传了familyid
        if (shareInfo?.family.id.toString() === familyid.toString()) {
            return thingType.shareDevice;
        } else if (deviceInfo.family?.id?.toString() === familyid.toString() && (isMember || isGuest)) {
            //是所在家庭的成员
            return thingType.shareFamilyMyDevice;
        } else {
            return thingType.noRelation;
        }
    }
}

module.exports = {
    //获取设备与用户的关系
    getRelationWithDevice,
};