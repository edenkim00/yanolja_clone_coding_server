const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveCityList = async function (name) {
  if (!name) {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectCity(connection);
    connection.release();

    return ListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectCityName(connection, name);
    connection.release();

    return ListResult;
  }
};

