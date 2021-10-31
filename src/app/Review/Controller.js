const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Review/Provider");
const Service = require("../../app/Review/Service");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");


exports.postReview = async function(req,res){
    try {

        const {"body" : {reservationId,kindScore,cleanScore,convenienceScore,goodsScore,text,photoList}} = req;
        if(!reservationId||!kindScore||!cleanScore||!convenienceScore||!goodsScore||!text) return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
        const [resResult] = await Provider.getResInfo(reservationId);
        if(!resResult)  return res.send(errResponse(baseResponse.RESERVATION_NOT_EXIST)); //7005
        const userId = resResult.userId;
        const userIdFromJWT = req.verifiedToken.userId;
        if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

        const reviewResult = await Provider.getReviewResId(reservationId);
        if(reviewResult) return res.send(errResponse(baseResponse.ALREADY_EXIST_REVIEW)); // 7004
        const result = await Service.postReview(reservationId, kindScore, cleanScore, convenienceScore, goodsScore, text);
        if (result.isSuccess != null && result.isSuccess == false) return res.send(errResponse(result));
        if (photoList) {
            var reviewresult2 = await Provider.getReviewResId(reservationId);
            var list = photoList.split(',');
            for (var imageUrl of list) {
                var photoresult = await Service.postPhoto(reviewresult2.id, imageUrl);
            }
        }

        return res.send(response(baseResponse.SUCCESS));
    }catch(err) {
        logger.error(`App - postReview Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


exports.getReview = async function (req, res) {
    const hotelId = req.query.hotelid;
    const userId = req.query.userid;
    if(!hotelId && !userId)
        return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    if(hotelId){
        const hotelResult = await Provider.getHotelId(hotelId);
        if(!hotelResult) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST)); //6000
        const result = await Provider.getReviewHotelId(hotelId);
        if(result.isSuccess != null && result.isSuccess == false) return res.send(errResponse(result));
        return res.send(response(baseResponse.SUCCESS,result));
    }
    else if(userId) {
        const userIdFromJWT = req.verifiedToken.userId;
        if (userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
        const userResult = await Provider.retrieveUser(userId);
        if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //
        const result = await Provider.getReviewUserId(userId);
        if(result.isSuccess != null && result.isSuccess == false) return res.send(errResponse(result));
        return res.send(response(baseResponse.SUCCESS,result));
    }
};

exports.deleteReview = async function (req, res) {
    const id = req.params.reviewId;
    const userresult = await Provider.selectUserIdFromReviewId(id);
    if(!userresult) return res.send(errResponse(baseResponse.REVIEW_NOT_EXIST));
    const userId=userresult.id;
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const result = await Service.deleteReview(id);
    return res.send(response(result));
};
exports.changeReview = async function (req, res) {
    const id = req.params.reviewId;
    const text = req.body.text;
    if(!text) return res.send(errResponse(baseResponse.REDUNDANT_BODY));
    const userresult = await Provider.selectUserIdFromReviewId(id);
    if(!userresult) return res.send(errResponse(baseResponse.REVIEW_NOT_EXIST));
    const userId=userresult.id;
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const result = await Service.changeReviewText(id,text);
    return res.send(response(result));
};
exports.changeReviewPhoto = async function (req, res) {
    const id = req.params.photoId;
    const text = req.body.imageUrl; // null이면 그 사진 삭제.
    const photoresult = await Provider.selectPhotoFromReviewPhotoId(id);
    if(!photoresult) return res.send(errResponse(baseResponse.REVIEW_PHOTO_NOT_EXIST)); // 7007
    const reviewId= photoresult.reviewId;
    console.log("리뷰아디: ",reviewId)
    const userresult = await Provider.selectUserIdFromReviewId(reviewId);
    if(!userresult) return res.send(errResponse(baseResponse.REVIEW_NOT_EXIST));
    const userId=userresult.id;
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const result = await Service.changeReviewPhoto(id,text);
    return res.send(response(result));
};
