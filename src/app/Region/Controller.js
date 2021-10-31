const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Region/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");



exports.getRegion = async function (req, res) {

    /**
     * Query String: name
     */
    const name = req.query.name;
    const cityId = req.query.cityid;

    if (name) {
        // 이름으로 조회
        const result = await Provider.RegionName(name);
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(cityId) {
        // 상위 시티id로 조회
        const cityresult = await Provider.CityId(cityId);
        console.log(cityresult);
        if(cityresult.length<1){
            return res.send(errResponse(baseResponse.CITY_ID_WRONG));
        }
        const result = await Provider.RegionId(cityId);
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else{
        const result = await Provider.Region();
        return res.send(response(baseResponse.SUCCESS, result));
    }
};



