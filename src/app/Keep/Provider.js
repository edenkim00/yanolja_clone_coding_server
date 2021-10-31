const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.getKeep = async function (userId,hotelId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectKeep(connection, [userId,hotelId]);
    connection.release();
    return userResult[0];
};
exports.retrieveUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectUserId(connection, userId);
    connection.release();
    return userResult[0];
};
exports.retrieveHotel= async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await Dao.selectHotelId(connection, id);
    connection.release();
    return userResult[0];
};

exports.getKeepUserId = async function(id,startTime,endTime,num){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        // 도시 id로 가능한 방 모두 조회(with 호텔)
        var ListResult = await Dao.selectHotelsByUserId(connection, id);
        // 조회한 결과들 기존 날짜와 인원수 적합한지 체크
        for (var i = 0; i < ListResult.length;) {
            if (ListResult[i].maxnum >= num) {
                var result = await Dao.selectCheckReservation(connection, ListResult[i].roomid, startTime, endTime);
                if (result.length > 0) {
                    ListResult.splice(i, 1);
                } else {
                    ListResult[i] = await Dao.selectSearchHotel(connection, ListResult[i].roomid,ListResult[i].hotelid);
                    i++;
                }
            } else ListResult.splice(i, 1);
        }
        // 중복된 호텔의 방 리스트 있으면 최저가 하나만 출력
        for (var i = 0; i < ListResult.length - 1; i++) {
            for (var j = i + 1; j < ListResult.length;) {
                if (ListResult[i].id == ListResult[j].id) {
                    if (ListResult[i].priceafterSale > ListResult[j].priceafterSale) {
                        ListResult[i] = ListResult[j];
                        ListResult.splice(j, 1);
                    } else {
                        ListResult.splice(j,1);
                    }
                }
                else j++;
            }
        }
        connection.commit();
        return ListResult;

    }catch(err){
        connection.rollback();
        logger.error(`App - SearchHotel error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally {
        connection.release();
    }
};