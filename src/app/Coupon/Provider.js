const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리


exports.retrieveUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectUserId(connection, userId);
    connection.release();
    return userResult[0];
};

exports.getCouponCode = async function (code) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectCouponCode(connection, code);
    connection.release();
    return result[0];
};

exports.getCouponUserId = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        var result = {};
        result["couponCount"] = await Dao.selectCouponCount(connection, id);
        result["couponlist"] = await Dao.selectCouponUserId(connection, id);
        connection.commit();
        return result;
    }catch(err){
        connection.rollback();
        logger.error(`App - getCoupon Service error\n: ${err.message} \n${JSON.stringify(err)}`);
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
