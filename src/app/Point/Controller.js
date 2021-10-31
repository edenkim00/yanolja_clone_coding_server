const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Point/Provider");
const Service = require("../../app/Point/Service");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");


exports.getUserPoint = async function(req,res){
    const userId = req.query.userid;
    if(!userId) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const result = await Provider.getUserPoint(userId);
    return res.send(response(baseResponse.SUCCESS,result));
}
// exports.postChangePoint = async function (req, res) {
//     const userId=req.body.userId;
//     const pointChange=req.body.pointChange;
//     const text1 = req.body.text1;
//     const text2 = req.body.text2;
//     if(!userId || !pointChange || !text1)
//         return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
//     const userIdFromJWT = req.verifiedToken.userId;
//     if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
//
//     const userResult = await Provider.retrieveUser(userId);
//     if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //
//
//     const  remainPoint = await Provider.getUserPoint(userId);
//     if(parseInt(remainPoint.remainPoint,10) + pointChange < 0) return res.send(errResponse(baseResponse.REDUNDANT_POINT_USE)); //7003
//
//     const result = await Service.postChangePoint(userId,pointChange);
//     return res.send(response(result));
// };
