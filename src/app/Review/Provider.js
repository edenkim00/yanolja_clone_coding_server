const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리
exports.getReviewHotelId = async function (hotelId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        var reviews=[];
        var result = await Dao.selectReviewIdHotelId(connection,hotelId);
        if(result.length < 1) return errResponse(baseResponse.REVIEW_NOT_EXIST); //7006
        var reviewIdlist = result[0].reviewId.split(',');
        for(var i of reviewIdlist){
            var reviewresult = await Dao.selectReviewReviewId(connection,i);
            var photoresult = await Dao.selectReviewPhoto(connection,i);
            if(photoresult.length<1) reviewresult[0]["photos"]=null;
            else reviewresult[0]["photos"]=photoresult;
            var commentresult = await Dao.selectReviewCommentReviewId(connection,i);
            if(commentresult.length<1)reviewresult[0]["comments"]=null;
            else reviewresult[0]["comments"]=commentresult;

            reviews.push(reviewresult[0]);
        }
        delete result[0].reviewId;
        result[0]["reviews"]=reviews;
        connection.commit();
        return result[0];

    }catch(err){
        connection.rollback();
        logger.error(`App - getReviewHotelId Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};
exports.getReviewUserId = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        var reviews=[];
        var reviewIdresult = await Dao.selectReviewIdUserId(connection,userId);
        if(reviewIdresult.length < 1) return errResponse(baseResponse.REVIEW_NOT_EXIST); //7006
        console.log(reviewIdresult);
        for(var i of reviewIdresult){
            var reviewresult = await Dao.selectReviewReviewId(connection,i.id);
            var photoresult = await Dao.selectReviewPhoto(connection,i.id);
            if(photoresult.length<1) reviewresult[0]["photos"]=null;
            else reviewresult[0]["photos"]=photoresult;
            var commentresult = await Dao.selectReviewCommentReviewId(connection,i.id);
            if(commentresult.length<1)reviewresult[0]["comments"]=null;
            else reviewresult[0]["comments"]=commentresult;

            reviews.push(reviewresult[0]);
        }

        connection.commit();
        return reviews;

    }catch(err){
        connection.rollback();
        logger.error(`App - getReviewHotelId Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

exports.getHotelId = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.getHotelId(connection, id);
    connection.release();
    return result[0];
}
exports.getReviewResId = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.getReviewResId(connection, id);
    connection.release();
    return result[0];
}
exports.retrieveUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectUserId(connection, userId);
    connection.release();
    return userResult[0];
};
exports.getResInfo = async function (id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.getResInfo(connection,id);
    connection.release();
    return result;
}
exports.getSearchListId = async function (id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectSearchListId(connection,id);
    connection.release();
    return result;
}

exports.selectUserIdFromReviewId = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectUserReviewId(connection,id);
    connection.release();
    return result[0];
}
exports.selectPhotoFromReviewPhotoId = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectPhotoReviewPhotoId(connection,id);
    connection.release();
    return result[0];
}