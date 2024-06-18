const response = require('../../utils/response');
const constant = require('../../utils/constant');
const { asyncTaskType, errorCode, memberInterests, userErrorCode } = constant;

function getMemberInfo(userInfo) {
    //会员字段不存在或者是最低的会员等级
    if (!userInfo.accountInfo || userInfo.accountInfo.level === memberInterests.free.level) {
        return response.ok(memberInterests.free);
    }

    //判断是否过期
    const now = new Date();
    const expireDate = userInfo.accountInfo.expiredAt;
    if (!(expireDate instanceof Date)) {
        return response.error(errorCode.internalError, `invalid account expireDate: ${JSON.stringify(userInfo.accountInfo)}`);
    }
    if (now >= expireDate) {
        return response.ok(memberInterests.free);
    }

    //遍历所有会员等级进行查找
    for (const key in memberInterests) {
        const item = memberInterests[key];
        if (userInfo.accountInfo.level === item.level) {
            return response.ok(item);
        }
    }

    return response.error(errorCode.internalError, `invalid account info: ${JSON.stringify(userInfo.accountInfo)}`);
}

module.exports = {
    //获取当前用户的会员信息
    getMemberInfo,
};