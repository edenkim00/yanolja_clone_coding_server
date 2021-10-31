const jwtMiddleware = require("../../../config/jwtMiddleware");
const Provider = require("../../app/Category/Provider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");



exports.getCategory = async function (req, res) {




    const result = await Provider.getCategory();
    return res.send(response(baseResponse.SUCCESS, result));

};



