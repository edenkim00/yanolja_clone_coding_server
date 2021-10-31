const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/City/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");



exports.getCity = async function (req, res) {

    /**
     * Query String: name
     */
    const name = req.query.name;

    if (!name) {
        // 유저 전체 조회
        const result = await Provider.retrieveCityList();
        return res.send(response(baseResponse.SUCCESS, result));
    } else {
        // 유저 검색 조회
        const result = await Provider.retrieveCityList(name);
        return res.send(response(baseResponse.SUCCESS, result));
    }
};



