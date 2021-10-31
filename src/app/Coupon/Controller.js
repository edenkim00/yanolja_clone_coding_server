const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Coupon/Provider");
const Service = require("../../app/Coupon/Service");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");


exports.getCouponUserId = async function(req,res){
    const userId = req.query.userid;
    if(!userId) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //
    const result = await Provider.getCouponUserId(userId);
    return res.send(response(baseResponse.SUCCESS,result));
}
exports.postCoupon = async function (req, res) {
    const userId=req.body.userId;
    const couponCode = req.body.couponCode;
    if(!userId || !couponCode)
        return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013

    const couponresult = await Provider.getCouponCode(couponCode);
    if(!couponresult) return res.send(errResponse(baseResponse.REDUNDANT_COUPON)); //7008
    const couponId = couponresult.id;
    const alreadyresult = await Provider.getCouponUserId(userId);
    for(var i of alreadyresult.couponlist){
        if(i.couponId==couponId) return res.send(errResponse(baseResponse.ALREADY_REGISTER_COUPON)); //7009
    }
    const result = await Service.postCoupon(userId,couponId);
    // if(parseInt(remainPoint.remainPoint,10) + pointChange < 0) return res.send(errResponse(baseResponse.REDUNDANT_POINT_USE)); //7003
    return res.send(response(result));
};
