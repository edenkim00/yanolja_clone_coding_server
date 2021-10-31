const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Hotel/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");
const userProvider = require("../../app/User/userProvider");
const Service = require("./Service");
const {logger} = require("../../../config/winston");
const axios = require("axios");

exports.recommend = async function (req,res){
    const userId = req.query.userid;
    if(!userId) return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST)); //6003
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016
    const userResult = await userProvider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST)); //2013
    const result = await Provider.recommendHotel(userId);
    if(result.length < 1) return res.send(errResponse(baseResponse.USER_SEARCH_HOTEL_EMPTY)); // 7002
    return res.send(response(baseResponse.SUCCESS, result));
};

exports.postuserWatch = async function (req,res){
    const userId = req.body.userId;
    const hotelId = req.body.hotelId;
    // validation
    if(!userId || !hotelId) return res.send(errResponse(baseResponse.REDUNDANT_BODY));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const userResult = await userProvider.retrieveUser(userId);
    if(!userResult) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    const hotelResult = await Provider.HotelId(hotelId);
    if(!hotelResult) return res.send(errResponse(baseResponse.HOTEL_NOT_EXIST));

    const result = await Service.postWatch(userId, hotelId);
    return res.send(result);
};

exports.getHotel = async function (req, res) {

    const keyword = req.query.keyword;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    var categorylist=req.query.categoryid;
    if (!keyword || !startTime || !endTime || !req.query.adult || !req.query.child || !categorylist)
        return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const num = parseInt(req.query.adult,10)+parseInt(req.query.child,10);
    const categoryId = categorylist.split(',');
    var Listresult=[];
    const city = await Provider.CityName(keyword);
    if(city.length>0){
        for(var j in categoryId) {
            var result = await Provider.SearchHotelCityId(city[0].id, startTime, endTime, num, parseInt(categoryId[j],10));
            if (result.length > 0){
                for(var k of result)
                    Listresult.push(k);
            }
        }
        if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
        return res.send(response(baseResponse.SUCCESS, Listresult));
    }
    const region = await Provider.RegionName(keyword);
    if(region.length>0){
        for(var j in categoryId) {
            var result = await Provider.SearchHotelRegionId(region[0].id, startTime, endTime, num, parseInt(categoryId[j],10));
            if (result.length > 0){
                for(var k of result)
                    Listresult.push(k);
            }
        }
        if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
        return res.send(response(baseResponse.SUCCESS, Listresult));
    }
    const hotelName = await Provider.HotelName(keyword);
    if(hotelName.length>0){
        for(var j in categoryId) {
            const result = await Provider.SearchHotelName(hotelName[0].name, startTime, endTime, num, parseInt(categoryId[j],10));
            if (result.length > 0){
                for(var k of result)
                    Listresult.push(k);
            }
        }
        if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
        return res.send(response(baseResponse.SUCCESS, Listresult));
    }
    return res.send(errResponse(baseResponse.NOT_KEYWORD));

};

exports.getHotelRegionId = async function (req, res) {
    var list = req.query.regionidlist;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    if (!list || !startTime || !endTime || !req.query.adult || !req.query.child || !req.query.categoryid)
        return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    const num = parseInt(req.query.adult,10)+parseInt(req.query.child,10);
    const categoryId = req.query.categoryid.split(',');
    var Listresult = [];


    list = list.split(',');

    for(var i in list){
        var check = await Provider.RegionId(parseInt(list[i],10));
        if(check.length == 0)return res.send(errResponse(baseResponse.REGION_ID_WRONG));
    }
    for (var j in categoryId) {
        for (var i in list) {
            var result = await Provider.SearchHotelRegionId(parseInt(list[i], 10), startTime, endTime, num, parseInt(categoryId[j],10));
            if (result.length > 0){
                for(var k of result) Listresult.push(k);
            }
        }
    }
    return res.send(response(baseResponse.SUCCESS, Listresult));

};

exports.getHotelLalng = async function(req,res){
    var {la,lng,startTime,endTime,adult,child,categoryid} =req.query;
    if (!la || !lng || !startTime || !endTime || !adult || !child || !categoryid)
        return res.send(errResponse(baseResponse.QUERYSTRING_NOT_EXIST));
    try {
        const num = parseInt(req.query.adult, 10) + parseInt(req.query.child, 10);
        const categoryId = req.query.categoryid.split(',');
        la = parseFloat(la);
        lng = parseFloat(lng);
        var Listresult = [];
        let regionresult;
        regionresult = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${la},${lng}&language=ko&key=AIzaSyATaOI03a6jS1UeC0D4zt-cHY6-jMFgJyY`, {
            method : 'GET'
        });
        var key = regionresult.data.results[0].address_components[2].short_name;
        var keyword = key.substr(0,key.length-1);
        var city1 = await Provider.CityName(keyword);
        var region1 = await Provider.RegionName(keyword);
        if(region1.length==0 && city1.length==0) {
            var key = regionresult.data.results[0].address_components[3].short_name;
            var keyword = key.substr(0,key.length-1);
        }

        console.log(keyword);
        const city = await Provider.CityName(keyword);
        if(city.length>0){
            for(var j in categoryId) {
                var result = await Provider.SearchHotelCityId(city[0].id, startTime, endTime, num, parseInt(categoryId[j],10));
                if (result.length > 0){
                    for(var k of result)
                        Listresult.push(k);
                }
            }
            if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
            const realresult = {"keyword":keyword,"list" : Listresult};
            return res.send(response(baseResponse.SUCCESS, realresult));
        }
        const region = await Provider.RegionName(keyword);
        if(region.length>0){
            for(var j in categoryId) {
                var result = await Provider.SearchHotelRegionId(region[0].id, startTime, endTime, num, parseInt(categoryId[j],10));
                if (result.length > 0){
                    for(var k of result)
                        Listresult.push(k);
                }
            }
            if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
            const realresult = {"keyword":keyword,"list" : Listresult};
            return res.send(response(baseResponse.SUCCESS, realresult));
        }
        const hotelName = await Provider.HotelName(keyword);
        if(hotelName.length>0){
            for(var j in categoryId) {
                const result = await Provider.SearchHotelName(hotelName[0].name, startTime, endTime, num, parseInt(categoryId[j],10));
                if (result.length > 0){
                    for(var k of result)
                        Listresult.push(k);
                }
            }
            if(Listresult.length < 1)   return res.send(errResponse(baseResponse.AVAILABLE_HOTEL_NOT_EXIST));
            const realresult = {"keyword":keyword,"list" : Listresult};
            return res.send(response(baseResponse.SUCCESS, realresult));
        }


        return res.send(errResponse(baseResponse.NOT_KEYWORD));
    }catch(err){
        logger.error(`App - searchHotellocation Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.getHotelId = async function (req, res) {
    const hotelId = req.params.hotelId;
    const result = await Provider.HotelId(hotelId);
    if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_ID_NOT_EXIST));
    const photoresult = await Provider.HotelPhoto(hotelId);
    if(photoresult.length < 1) result[0]["imageUrl"]=null;
    else result[0]["imageUrl"]=photoresult;
    return res.send(response(baseResponse.SUCCESS, result[0]));

};
exports.getPhoto = async function (req,res){
    const hotelId = req.params.hotelId;
    const result = await Provider.Hotel(hotelId);
    if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_ID_NOT_EXIST));
    const photoresult = await Provider.HotelPhoto(hotelId);
    return res.send(response(baseResponse.SUCCESS,photoresult));
}
exports.getFacility = async function (req,res){
    const hotelId = req.params.hotelId;
    const result = await Provider.Hotel(hotelId);
    if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_ID_NOT_EXIST));
    const facilityresult = await Provider.HotelFacility(hotelId);
    return res.send(response(baseResponse.SUCCESS,facilityresult));
}
exports.getSellerInfo = async function (req,res){
    const hotelId = req.params.hotelId;
    const result = await Provider.Hotel(hotelId);
    if (!result[0]) return res.send(errResponse(baseResponse.HOTEL_ID_NOT_EXIST));
    const sellerresult = await Provider.HotelSellerInfo(hotelId);
    return res.send(response(baseResponse.SUCCESS,sellerresult[0]));
}
