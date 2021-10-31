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

exports.postKeep = async function (userId,hotelId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const result = await Dao.postKeep(connection, [userId,hotelId]);
        return {"isPost" : "등록함"};
    }catch(err){
        logger.error(`App - postKeep Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
exports.activateKeep = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const result = await Dao.activateKeep(connection, id);
        return {"isPost" : "등록함"};
    }catch(err){
        logger.error(`App - activateKeep Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
exports.deleteKeep = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const result = await Dao.deleteKeep(connection, id);
        return {"isPost" : "삭제함"};
    }catch(err){
        logger.error(`App - deleteKeep Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};