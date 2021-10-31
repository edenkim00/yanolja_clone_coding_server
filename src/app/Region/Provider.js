const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.RegionName = async function (name) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectRegionName(connection, name);
    connection.release();

    return ListResult;

};

exports.Region = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectRegion(connection);
    connection.release();
    return ListResult;
};
exports.RegionId = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);

    const ListResult = await Dao.selectRegionCityId(connection, id);
    connection.release();
    return ListResult;
};
exports.CityId = async function (id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectCityId(connection,id);
    connection.release();
    return result;
}