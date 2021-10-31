const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Advertising/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");



exports.getAdvertise = async function (req, res) {
    
    const result = await Provider.getAdvertise();
    return res.send(response(baseResponse.SUCCESS, result));

};



