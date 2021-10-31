const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const Dao = require("./Dao");

// Provider: Read 비즈니스 로직 처리

exports.recommendHotel = async function(id){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        var result = await Dao.selectHotelRecommend(connection,id);
        for(var i =0;i<result.length;){
            var result2 = await Dao.selectHotelRecommend2(connection,result[i].id);
            result[i] = result2;
            i++;
        }
        connection.commit();
        return result;
    }catch(err){
        connection.rollback();
        logger.error(`App - RecommendHotel error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
};

exports.SearchHotelCityId = async function(id,startTime,endTime,num,categoryId){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        // 도시 id로 가능한 방 모두 조회(with 호텔)
        var ListResult = await Dao.selectHotelsByCityId(connection, id,categoryId);
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
}

exports.SearchHotelRegionId = async function(id,startTime,endTime,num,categoryId){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        // 도시 id로 가능한 방 모두 조회(with 호텔)
        var ListResult = await Dao.selectHotelsByRegionId(connection, id,categoryId);
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
}
exports.SearchHotelName = async function(name,startTime,endTime,num,categoryId){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        connection.beginTransaction();
        // 도시 id로 가능한 방 모두 조회(with 호텔)
        var ListResult = await Dao.selectHotelsByName(connection, name,categoryId);
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
}

exports.Hotel = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotel(connection);
    connection.release();
    return ListResult;
};

exports.HotelName = async function (name) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotelName(connection, name);
    connection.release();
    return ListResult;

};
exports.HotelCityId = async function (id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotelCityId(connection, id);
    connection.release();
    return ListResult;

};
exports.HotelRegionId = async function (id) {

    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotelRegionId(connection, id);
    connection.release();
    return ListResult;

};


exports.HotelId = async function (id) {
    const connection = await pool.getConnection(async (conn) => conn);
    const ListResult = await Dao.selectHotelId(connection, id);
    connection.release();
    return ListResult;
};


exports.RegionId = async function(id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectRegionId(connection,id);
    connection.release();
    return result;
}
exports.CityId = async function (id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectCityId(connection,id);
    connection.release();
    return result;
}
exports.RegionName = async function(name){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectRegionName(connection,name);
    connection.release();
    return result;
}
exports.CityName = async function (name){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectCityName(connection,name);
    connection.release();
    return result;
}
exports.HotelPhoto = async function(id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectHotelPhoto(connection,id);
    connection.release();
    return result;}
exports.HotelFacility = async function(id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectHotelFacility(connection,id);
    connection.release();
    return result;}
exports.HotelSellerInfo = async function(id){
    const connection = await pool.getConnection(async(conn) => conn);
    const result = await Dao.selectHotelSellerInfo(connection,id);
    connection.release();
    return result;
}