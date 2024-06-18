/**
 * @api {post} /v2/family 新增家庭
 * 
 * @apiGroup 家庭和房间(Family)
 * @apiName family-addFamily
 * 
 * @apiBody {String} name 家庭名称
 * @apiBody {Int=1,2} sort 给新家庭分配序号的方式<br/>1:更小的序号<br/>2:更大的序号
 * @apiBody {String[]} [roomNameList] 房间名称列表，服务端按列表顺序对新创建的房间生成对应序号
 * 
 * @apiSuccess {String} id 家庭id
 * @apiSuccess {String} name 家庭名称
 * @apiSuccess {Int} index 家庭排序号
 * @apiSuccess {Int} familyType 家庭的类型<br/>1：自己的家庭<br/>2：别人分享的家庭
 * @apiSuccess {Object[]} [roomList] 房间列表
 * @apiSuccess {String} roomList.id 房间id
 * @apiSuccess {String} roomList.name 房间名称
 * @apiSuccess {Int} roomList.index 房间排序号，可能存在负数
 * @apiSuccess {Object[]} members 家庭成员信息列表，该接口中必定为空数组
 * @apiSuccess {String} members.apikey 用户apikey
 * @apiSuccess {String} [members.phoneNumber] 手机号码，手机号码和邮箱至少有一个
 * @apiSuccess {String} [members.email] 邮箱，手机号码和邮箱至少有一个
 * @apiSuccess {String} [members.nickname] 昵称
 * @apiSuccess {String} [members.comment] 备注
 * @apiSuccess {String} [members.wxNickname] 微信昵称。仅当小程序调用接口，且对方曾经授权获取易微联小程序获取过微信昵称，返回该字段
 * @apiSuccess {String} [members.wxAvatar] 微信头像。仅当小程序调用接口，且对方曾经授权获取易微联小程序获取过微信昵称，返回该字段
 */
const Joi = require('joi');

const { errorCode, familyErrorCode, familyType } = require('../../utils/constant');

const userService = require('../../service/user');

const familyDao = require('../../dao/mongo/iotgo/families');

const paramsSchema = Joi.object({
    'name': Joi.string().required(true),
    'sort': Joi.number().strict().integer().min(1).max(2).required(true),
    'roomNameList': Joi.array().items(Joi.string()).default([]),
}).required().unknown(true);


module.exports = async (req, res) => {
    const { userInfo } = req.authRes.data;

    const { apikey } = userInfo;
    const resourceLimitRet = userService.getMemberInfo(userInfo);
    if (resourceLimitRet.error) {
        return res.responseError(resourceLimitRet.error, resourceLimitRet.msg);
    }
    const { resourceLimit } = resourceLimitRet.data;

    const familyNum = await familyDao.getNumOfUserOwnFamily(apikey);

    //家庭数量达到上限
    if (familyNum >= resourceLimit.familyMax) {
        return res.responseError(familyErrorCode.familyRoomLimit, 'the family quantity has reached the limit');
    }

    const { name, sort, roomNameList } = req.body;

    const familyInfo = {
        apikey,
        name,
        rooms: roomNameList.map((roomName, index) => ({ name: roomName, index })),
    };

    //为新家庭设置index
    if (sort === 1) {
        const minIndex = await familyDao.getUserMinSeqFamily(apikey);
        familyInfo.index = minIndex.index - 1;
    } else {
        const maxIndex = await familyDao.getUserMaxSeqFamily(apikey);
        familyInfo.index = maxIndex.index + 1;
    }

    //创建家庭
    const newFamilyInfo = await familyDao.createFamily(familyInfo);

    return res.responseOk({
        id: newFamilyInfo._id.toHexString(),
        name,
        index: newFamilyInfo.index,
        roomList: newFamilyInfo.rooms.map(roomInfo => ({
            id: roomInfo._id.toHexString(),
            name: roomInfo.name,
            index: roomInfo.index,
        })),
        familyType: familyType.myFamily,
        members: [],
    });
};