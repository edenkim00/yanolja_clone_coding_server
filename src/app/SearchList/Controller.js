const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/SearchList/Provider");
const Service = require("../../app/SearchList/Service");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");



exports.postRecord = async function (req, res) {
    const userId=req.body.userId;
    const keyword=req.body.keyword;
    const startTime=req.body.startTime;
    const endTime=req.body.endTime;
    const adult=req.body.adult;
    const child=req.body.child;
    if(userId==null || !keyword||!startTime||!endTime||adult==null||child==null)
        return res.send(errResponse(baseResponse.REDUNDANT_BODY)); //6005
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //
    const result = await Service.postRecord(userId,keyword,startTime,endTime,adult,child);
    return res.send(response(result));
};


exports.getSearchList = async function (req, res) {
    const userId = req.query.userid;
    if(!userId)return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await Provider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //
    const result = await Provider.getSearchList(userId);
    return res.send(response(baseResponse.SUCCESS,result));
};

exports.deleteSearchList = async function (req, res) {
    const id = req.params.recordId;
    if(!id)return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const searchresult = await Provider.getSearchListId(id);
    if(!searchresult) return res.send(errResponse(baseResponse.SEARCH_NOT_EXIST));

    const userId=searchresult.userId;
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const result = await Service.deleteSearchList(id,userId);
    return res.send(response(result));
};

exports.deleteSearchListAll = async function (req, res) {
    const userId = req.query.userid;
    if(!userId)return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const result = await Service.deleteSearchListAll(userId);
    return res.send(response(result));
};
