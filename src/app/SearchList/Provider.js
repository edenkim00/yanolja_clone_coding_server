const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리


exports.retrieveUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectUserId(connection, userId);
    connection.release();
    return userResult[0];
};
exports.getSearchList = async function (userId){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectSearchList(connection,userId);
    connection.release();
    return result;
}
exports.getSearchListId = async function (id){
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await Dao.selectSearchListId(connection,id);
    connection.release();
    return result;
}
