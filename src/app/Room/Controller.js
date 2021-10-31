const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Room/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");


exports.getRoom = async function (req, res) {

    /**
     * Query String: name
     */
    const hotelName = req.query.hotelname;
    const hotelId = req.query.hotelid;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    // 호텔 id로 조회
    if(hotelId) {
        const result = await Provider.HotelId(hotelId);
        if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST));
        const roomresult = await Provider.RoomHotelId(hotelId,startTime,endTime);
        return res.send(response(baseResponse.SUCCESS, roomresult));
    }

    // 호텔 이름으로 조회
    else if(hotelName){
        const result = await Provider.HotelName(hotelName);
        if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST));
        const roomresult = await Provider.RoomHotelName(hotelName,startTime,endTime);
        return res.send(response(baseResponse.SUCCESS, roomresult));
    }

    return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));

};


exports.getRoomId = async function (req, res) {
    const id = req.params.roomId;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    if(!id || !startTime || !endTime) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const result = await Provider.RoomId(id,startTime,endTime);
    if (!result[0]) return res.send(errResponse(baseResponse.ROOM_ID_NOT_EXIST));

    const photoresult = await Provider.RoomPhoto(id);
    if(photoresult.length < 1) result[0]["imageUrl"]=null;
    else result[0]["imageUrl"]=photoresult;
    return res.send(response(baseResponse.SUCCESS, result[0]));

};

exports.getRoomPhoto = async function (req, res) {
    const id = req.params.roomId;
    const result = await Provider.RoomId(id);
    if (!result[0]) return res.send(errResponse(baseResponse.ROOM_ID_NOT_EXIST));
    const photoresult = await Provider.RoomPhoto(id);
    return res.send(response(baseResponse.SUCCESS, photoresult));

};