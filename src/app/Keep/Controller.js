const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Keep/Provider");
const Service = require("../../app/Keep/Service");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");


// exports.getUserPoint = async function(req,res){
//     const userId = req.query.userid;
//     if(!userId) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
//     const userIdFromJWT = req.verifiedToken.userId;
//     if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
//     const result = await Provider.getUserPoint(userId);
//     return res.send(response(baseResponse.SUCCESS,result));
// }
exports.postKeep= async function (req, res) {
    const userId=req.body.userId;
    const hotelId=req.body.hotelId;
    if(!userId || !hotelId)
        return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013
    const hotelResult = await Provider.retrieveHotel(hotelId);
    if(!hotelResult) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST)); //6000

    const  presentresult = await Provider.getKeep(userId,hotelId);
    if(!presentresult){
        var result = await Service.postKeep(userId,hotelId);
        return res.send(response(baseResponse.SUCCESS,result));
    }
    else if(presentresult.status=='DELETED'){
        var result = await Service.activateKeep(presentresult.id);
        return res.send(response(baseResponse.SUCCESS,result));

    }
    else {
        var result = await Service.deleteKeep(presentresult.id);
        return res.send(response(baseResponse.SUCCESS,result));
    }

};

exports.keepCheck = async function(req,res){
    const userId = req.query.userid;
    const hotelId = req.query.hotelid;
    if(!userId || !hotelId) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013
    const hotelResult = await Provider.retrieveHotel(hotelId);
    if(!hotelResult) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST)); //6000
    const result = await Provider.getKeep(userId,hotelId);
    if(result && result.status =='Active') return res.send(response(baseResponse.SUCCESS,{"isKept" : true}));
    else return res.send(response(baseResponse.SUCCESS,{"isKept":false}));
}
exports.getKeepUserId = async function(req,res){
    const userId = req.query.userid;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    if (!userId || !startTime || !endTime || !req.query.adult || !req.query.child) //6003
        return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const num = parseInt(req.query.adult,10)+parseInt(req.query.child,10);
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013

    var result = await Provider.getKeepUserId(userId,startTime, endTime, num);
    if (result.length == 0) return res.send(errResponse(baseResponse.KEEP_NOT_EXIST)); //7013

    return res.send(response(baseResponse.SUCCESS, result));
    

}