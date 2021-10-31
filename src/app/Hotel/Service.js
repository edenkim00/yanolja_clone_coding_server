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

exports.postWatch = async function (userId,hotelId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const check = await Dao.checkWatch(connection, [userId,hotelId]);
        if(check.length>0) var result = await Dao.updateWatch(connection, check[0].id);
        else var result = await Dao.postWatch(connection, [userId, hotelId]);
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - postWatch Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

