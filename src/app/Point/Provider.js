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

exports.getUserPoint = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);
    var result={};
    try{
        connection.beginTransaction();
        var remainresult = await Dao.selectPointUser(connection, userId);
        var expireremainresult = await Dao.selectwillbeExpiredPoint(connection,userId);
        var list = await Dao.selectPointChangelist(connection,userId);
        result["remainPoint"]=parseInt(remainresult.remainPoint,10);
        result["expiredsoonPoint"]=parseInt(expireremainresult.willbeexpiredPoint,10);
        result["pointchangeList"]=list;
        connection.commit();
        return result;
    }catch(err){
        connection.rollback();
        logger.error(`App - getPoint Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
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
