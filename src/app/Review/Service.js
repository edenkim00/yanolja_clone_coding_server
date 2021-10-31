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
exports.postReview = async function (resId,kindScore,cleanScore,convenienceScore,goodsScore,text){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        var score = parseInt(kindScore,10) + parseInt(cleanScore,10) + parseInt(convenienceScore,10) + parseInt(goodsScore,10);
        score /= 4;
        const result = await Dao.postReview(connection, [resId,kindScore,cleanScore,convenienceScore,goodsScore,score, text]);
        connection.release();
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - postReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.postPhoto = async function (reviewId,imageUrl){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await Dao.postPhoto(connection, [reviewId,imageUrl]);
        connection.release();
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - postReviewPhoto Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.deleteReview = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const Result = await Dao.deleteReview(connection, id);
        connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        logger.error(`App - deleteReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

exports.changeReviewText = async function(id,text){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const Result = await Dao.changeReviewText(connection, id,text);
        connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        logger.error(`App - changeReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

exports.changeReviewPhoto = async function(id,text){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        if(text) {
            var Result = await Dao.changeReviewPhoto(connection, id, text);
        }
        else var Result = await Dao.deleteReviewPhoto(connection, id);
        connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        logger.error(`App - changeReviewPhoto Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

