const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const Dao = require("./Dao");
const couponProvider = require("../Coupon/Provider");

// Provider: Read 비즈니스 로직 처리

exports.checkCoupon = async function (userId,couponId,date) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.checkCoupon(connection, userId,couponId,date);
    connection.release();
    return userResult[0];
};
exports.retrieveUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectUserId(connection, userId);
    connection.release();
    return userResult[0];
};
exports.retrieveRoom = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectRoomId(connection, roomId);
    connection.release();
    return result[0];
};

exports.getInfo = async function (userId,roomId,startTime,endTime) {
    const connection = await pool.getConnection(async (conn) => conn);
    var result = {};
    try{
        connection.beginTransaction();
        const roomresult = await Dao.selectRoomInfo(connection, roomId,startTime,endTime);
        var userresult = await Dao.selectUserInfo(connection, userId);
        const coupon = await couponProvider.getCouponUserId(userId);
        result["roomInfo"] = roomresult[0];
        userresult[0]["remainPoint"] = parseInt(userresult[0]["remainPoint"],10);
        if(coupon["couponlist"].length>0) {
            for(var i of coupon["couponlist"]) {
                delete i.imageUrl;
                delete i.validDate;
                delete i.text;
                delete i.remainTime;
            }
            userresult[0]["couponlist"] = coupon["couponlist"];
        }
        else userresult["couponlist"] = null;
        result["userInfo"] = userresult[0];
        connection.commit();
        return result;
    }catch(err){
        connection.rollback();
        logger.error(`App - getInfo(RES) Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
// exports.getSearchList = async function (userId){
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await Dao.selectSearchList(connection,userId);
//     connection.release();
//     return result;
// }
// exports.getSearchListId = async function (id){
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await Dao.selectSearchListId(connection,id);
//     connection.release();
//     return result;
// }
