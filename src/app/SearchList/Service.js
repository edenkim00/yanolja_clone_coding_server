const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const Provider = require("./Provider");
const Dao = require("./Dao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postRecord = async function (userId,keyword,startTime,endTime,adult,child) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const ListResult = await Dao.postRecord(connection, [userId, keyword, startTime, endTime, adult, child]);
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - postSearchList Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
exports.deleteSearchList = async function(id,userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Provider.getSearchListId(id);
    try {
        connection.beginTransaction();
        if(!result) return errResponse(baseResponse.SEARCH_NOT_EXIST);
        if(result.userId != userId) return errResponse(baseResponse.USER_ID_NOT_MATCH); //2016
        const ListResult = await Dao.deleteRecord(connection, id);
        connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        logger.error(`App - deleteSearchList Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
exports.deleteSearchListAll = async function(userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.deleteAll(connection,userId);
    connection.release();
    return response(baseResponse.SUCCESS);
};
