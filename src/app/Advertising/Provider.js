const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.getAdvertise = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectAd(connection);
    connection.release();
    return ListResult;
};

