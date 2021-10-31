const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Reservation/Provider");
const Service = require("../../app/Reservation/Service");
const pointProvider = require("../Point/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");

exports.postRes = async function(req,res){
    var {"body" : {userId,roomId,hotelId,startTime,endTime,price,finalPrice,howtoPay,couponId,pointUse,userName,userphoneNumber,realuserName,realuserphoneNumber,howtoCome}} = req;
    if(!pointUse) var pointUse=0;
    if(!roomId || !userId || !hotelId || !startTime||!endTime||!price||finalPrice==null||!howtoPay || pointUse==null || !userName || !userphoneNumber || !realuserName || !realuserphoneNumber
    || !howtoCome) return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013
    const roomresult = await Provider.retrieveRoom(roomId);
    if(!roomresult) return res.send(errResponse(baseResponse.ROOM_ID_NOT_EXIST)); //6001
    const pointResult = await pointProvider.getUserPoint(userId);
    if(parseInt(pointResult.remainPoint,10) < parseInt(pointUse,10)) return res.send(errResponse(baseResponse.REDUNDANT_POINT_USE)); //7003

    const result = await Service.postRes(userId,roomId,hotelId,startTime,endTime,price,finalPrice,howtoPay,pointUse,userName,userphoneNumber,realuserName,realuserphoneNumber,howtoCome,couponId);
    return res.send(response(result));
}

exports.getInfo = async function(req,res){
    const userId = req.query.userid;
    const roomId = req.query.roomid;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    if(!userId || !roomId || !startTime || !endTime) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const roomresult = await Provider.retrieveRoom(roomId);
    if(!roomresult) return res.send(errResponse(baseResponse.ROOM_ID_NOT_EXIST)); //6001
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013
    
    const result = await Provider.getInfo(userId,roomId,startTime,endTime);
    return res.send(response(baseResponse.SUCCESS,result));
}

