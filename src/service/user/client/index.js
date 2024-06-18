/**
 * 这里的方法主要操作用户在各客户端上的配置
 */
const userDao = require('../../../dao/mongo/iotgo/users');
// const clientSettingsDao = require('../../../dao/mongo/iotgo/user_client_settings');

/**
 * 更新用户App的额外推送通道
 * @param {obejct} userInfo 
 * @param {string} appid 
 * @param {object} newExtraPush 
 * @returns 
 */
async function updateClientExtraPush(userInfo, appid, newExtraPush) {
    const apikey = userInfo.apikey;
    const oldExtraPush = userInfo.extraPush?.[appid];
    if (!oldExtraPush && !newExtraPush) {
        //原先没有推送渠道，这次也没有
        return;
    }

    if (oldExtraPush && !newExtraPush) {
        //原先有，这次没有，要把原先的删掉
        await userDao.update(apikey, { apikey }, { $unset: { [`extraPush.${appid}`]: 1 } });
        //新表，目前只做双写，以后逐步将user表中客户端信息迁移出去
        // await clientSettingsDao.update(apikey, appid, { $unset: { 'settings.pushChannel': 1 } });
        return;
    }

    //剩下两种情况
    //1. 原先没有，这次有
    //2. 原先有，这次也有
    //都保存起来
    await userDao.update(apikey, { apikey }, { $set: { [`extraPush.${appid}`]: newExtraPush } });
    //新表，目前只做双写，以后逐步将user表中客户端信息迁移出去
    // await clientSettingsDao.upsert(apikey, appid, { $set: { 'settings.pushChannel': newExtraPush } });

    return;
}

module.exports = {
    updateClientExtraPush,
};