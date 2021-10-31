const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const Provider = require("./Provider");
const Dao = require("./Dao");
const pointDao = require("../Point/Dao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postRes = async function (userId,roomId,hotelId,startTime,endTime,price,finalPrice,howtoPay,pointUse,userName,userphoneNumber,realuserName,realuserphoneNumber,howtoCome,couponId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const pointChange = parseInt(pointUse,10) * -1;
    try {
        connection.beginTransaction();
        const datecheck = await Dao.dateCheck(connection, roomId,startTime,endTime);
        if(datecheck.length > 0) {
            connection.rollback();
            return errResponse(baseResponse.ALREADY_FULL_ROOM); // 7011
        }
        if(parseInt(pointUse,10)>0)result = await pointDao.postChange(connection, [userId,pointChange,"숙소예약에 사용",null]);
        const result2 = await Dao.postRes(connection, [userId,roomId,hotelId,startTime,endTime,price,finalPrice,howtoPay,pointUse,userName,userphoneNumber,realuserName,realuserphoneNumber,howtoCome,couponId]);

        if(couponId){
            var couponresult = await Provider.checkCoupon(userId,couponId,startTime);
            if(!couponresult){
                connection.rollback();
                return errResponse(baseResponse.CANNOT_USE_COUPON); // 7010
            } // 7009
            if(parseInt(couponresult.salePrice,10) + parseInt(pointUse,10) != parseInt(price,10) - parseInt(finalPrice,10)){
                connection.rollback();
                return errResponse(baseResponse.PRICE_FINAL_NOT_MATCH);
            }
            var coupondeleteresult = await Dao.deleteCoupon(connection,couponresult.cuid);
        }
        else {
            if(parseInt(pointUse,10) != parseInt(price,10) - parseInt(finalPrice,10)){
                connection.rollback();
                return errResponse(baseResponse.PRICE_FINAL_NOT_MATCH);
            }
        }
        connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        logger.error(`App - postReservation Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
// exports.deleteCoupon = async function (id){
//     const connection = await pool.getConnection(async (conn) => conn);
//     const result = await Dao.deleteCoupon(connection,id);
//     connection.release();
//     return response(baseResponse.SUCCESS);
// }

// exports.checkCoupon = async function (userId,couponId) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     try {
//         connection.beginTransaction();
//         const result = await Dao.checkCoupon(userId,couponId);
//         connection.commit();
//         return response(baseResponse.SUCCESS);
//     }catch(err){
//         connection.rollback();
//         logger.error(`App - postReservation Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }finally {
//         connection.release();
//     }
// };