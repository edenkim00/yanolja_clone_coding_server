const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response, errResponse} = require("../../../config/response");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.RoomHotelId = async function (id,startTime,endTime) {

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const ListResult = await Dao.selectRoomHotelId(connection, id);
        for (var i = 0; i < ListResult.length;) {
            var result = await Dao.selectRoomRes(connection, ListResult[i].id, startTime, endTime);
            if (result.length > 0) {
                ListResult.splice(i, 1);
            } else i++;
        }
        connection.commit();
        return ListResult;
    }catch(err){
        connection.rollback();
        logger.error(`App - RoomHotelId error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }


};

exports.RoomHotelName = async function (name,startTime,endTime) {

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        const ListResult = await Dao.selectRoomHotelName(connection, name);
        for (var i = 0; i < ListResult.length;) {
            var result = await Dao.selectRoomRes(connection, ListResult[i].id, startTime, endTime);
            if (result.length > 0) {
                ListResult.splice(i, 1);
            } else i++;
            connection.commit();
            return ListResult;
        }
    }catch(err){
        connection.rollback();
        logger.error(`App - RoomHotelName error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};

exports.RoomId = async function (id,startTime,endTime) {

    const connection = await pool.getConnection(async (conn) => conn);
    var res = await Dao.selectRoomRes(connection,id,startTime,endTime);
    if(res.length>0){
        var ListResult = await Dao.selectRoomAlreadyFull(connection,id);
    }
    else var ListResult = await Dao.selectRoomId(connection, id);
    connection.release();

    return ListResult;

};

exports.RoomPhoto = async function (id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectRoomPhoto(connection, id);
    connection.release();

    return ListResult;

};


exports.HotelName = async function (name) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotelName(connection, name);
    connection.release();

    return ListResult;

};

exports.HotelId = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);

    const ListResult = await Dao.selectHotelId(connection, id);
    connection.release();
    return ListResult;
};


