const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const Provider = require("./Provider");
const Dao = require("./Dao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// exports.postChangePoint = async function (userId,pointChange) {
//     const connection = await pool.getConnection(async (conn) => conn);
//
//     try {
//         const result = await Dao.postChange(connection, [userId,pointChange]);
//         return response(baseResponse.SUCCESS);
//     }catch(err){
//         logger.error(`App - postSearchList Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }finally {
//         connection.release();
//     }
// };