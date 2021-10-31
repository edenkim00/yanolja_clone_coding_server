// 모든 유저 조회
async function postWatch(connection, params){
    const Query = `
        INSERT INTO UserHotel(userId, hotelId)
        VALUES (?, ?);
                `;
    const [Rows] = await connection.query(Query,params);
    return Rows;
}
async function checkWatch(connection, params){
    const Query = `
        select id from UserHotel where userId = ? && hotelId = ?
                `;
    const [Rows] = await connection.query(Query,params);
    return Rows;
}

async function updateWatch(connection, id){
    const Query = `
        UPDATE UserHotel
        SET updatedAt = current_timestamp
        WHERE id = ?;
                `;
    const [Rows] = await connection.query(Query,id);
    return Rows;
}
async function selectHotel(connection) {
  const Query = `
                SELECT id,name
                FROM Hotel;
                `;
  const [Rows] = await connection.query(Query);
  return Rows;
}
async function selectHotelRecommend(connection,id) {
    const Query = `
        select h.id from Hotel h
                          inner join (select regionId from Hotel h inner join UserHotel uh on uh.userId=? where h.id=uh.hotelId group by regionId) rh
        where h.regionId = rh.regionId limit 10;
    `;
    const [Rows] = await connection.query(Query,id);
    return Rows;
}

async function selectHotelRecommend2(connection,id) {
    const Query = `
        select h.id, hp.imageUrl, h.name,
               (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                             inner join Hotel h on h.id = ?
                                             inner join Reservation res on res.hotelId=h.id
                where r.reservationId=res.id) as reviewScore,
               (select count(r.id) from Review r
                                            inner join Hotel h on h.id = ?
                                            inner join Reservation res on res.hotelId = h.id
                where r.reservationId=res.id) as reviewCount,
               r.pricebeforeSale, r.saleRate, r.priceafterSale from Hotel h
                                                                        left outer join HotelPhoto hp on hp.imageUrl = (select hp.imageUrl from HotelPhoto hp where hp.hotelId = h.id limit 1)
            left outer join Room r on r.priceafterSale = (select min(r.priceafterSale) from Room r where r.hotelId = h.id)
        where h.id=?;
    `;
    const [Rows] = await connection.query(Query,[id,id,id]);
    return Rows[0];
}

async function selectHotelName(connection, name) {
  const Query = `
      select h.id, h.level, h.name,
             (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                            inner join Hotel h on h.name = ?
                                           inner join Reservation res on res.hotelId=h.id
              where r.reservationId=res.id) as reviewScore,
             (select count(r.id) from Review r
                                            inner join Hotel h on h.name = ?
                                          inner join Reservation res on res.hotelId = h.id
              where r.reservationId=res.id) as reviewCount,
             h.subwayText,h.callingNumber, h.aboutHotel, h.facility, h.locatedAt
      from Hotel h
      where h.name=?;
                `;
  const [Rows] = await connection.query(Query, [name,name,name]);
  return Rows;
}

async function selectHotelCityId(connection, id) {
    const Query = `
        select h.id, h.level, h.name,
               (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                             inner join Hotel h on h.cityId = ?
                                             inner join Reservation res on res.hotelId=h.id
                where r.reservationId=res.id) as reviewScore,
               (select count(r.id) from Review r
                                            inner join Hotel h on h.cityId = ?
                                            inner join Reservation res on res.hotelId = h.id
                where r.reservationId=res.id) as reviewCount,
               h.subwayText,h.callingNumber, h.aboutHotel, h.facility, h.locatedAt
        from Hotel h
        where h.cityId=?;
                `;
    const [Rows] = await connection.query(Query, [id,id,id]);
    return Rows;
}

async function selectSearchHotel(connection, roomid,hotelid) {
    const Query = `
        select h.id, hp.imageUrl, h.name,
               (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                             inner join Hotel h on h.id = ?
                                             inner join Reservation res on res.hotelId=h.id
                where r.reservationId=res.id) as reviewScore,
               (select count(r.id) from Review r
                                            inner join Hotel h on h.id = ?
                                            inner join Reservation res on res.hotelId = h.id
                where r.reservationId=res.id) as reviewCount,
               c.name as categoryName, h.subwayText, r.kindText, r.pricebeforeSale, r.saleRate, r.priceafterSale
        from Room r
                 inner join Hotel h on h.id=?
                 inner join CategoryHotel ch on ch.hotelId = h.id
                 inner join Category c on c.id = ch.categoryId
                 left outer join HotelPhoto hp on hp.imageUrl = (select hp.imageUrl from HotelPhoto hp where hp.hotelId = h.id limit 1)
        where r.id = ? && r.hotelId=h.id;
                `;
    const [Rows] = await connection.query(Query, [hotelid,hotelid,hotelid,roomid]);
    return Rows[0];
}

async function selectHotelsByCityId(connection, id,categoryId){
    const Query = `
           select r.id as roomid, h.id as hotelid, r.maxNumber as maxnum from Hotel h
                   inner join Room r on r.hotelId=h.id
                    inner join CategoryHotel ch on (ch.categoryId=? && ch.hotelId=h.id)
       where h.cityId=?;`;
    const [Rows] = await connection.query(Query, [categoryId,id]);
    return Rows;

}

async function selectHotelsByRegionId(connection, id,categoryId){
    const Query = `
           select r.id as roomid, h.id as hotelid, r.maxNumber as maxnum from Hotel h
                   inner join Room r on r.hotelId=h.id
                   inner join CategoryHotel ch on (ch.categoryId=? && ch.hotelId=h.id)
       where h.regionId=?;`;
    const [Rows] = await connection.query(Query, [categoryId,id]);
    return Rows;
}
async function selectHotelsByName(connection, name,categoryId){
    const Query = `
           select r.id as roomid, h.id as hotelid, r.maxNumber as maxnum from Hotel h
                   inner join Room r on r.hotelId=h.id
                   inner join CategoryHotel ch on (ch.categoryId=? && ch.hotelId=h.id)
       where h.name=?;`;
    const [Rows] = await connection.query(Query, [categoryId,name]);
    return Rows;
}

async function selectCheckReservation(connection, id,startTime,endTime){
    const Query = `
        select * from Reservation r
        where (endTime > ? && startTime < ? && r.roomId =?);
        `;
    const [Rows] = await connection.query(Query, [startTime,endTime,id]);
    return Rows;
}

async function selectHotelRegionId(connection, id) {
    const Query = `
        select h.id, h.level, h.name,
               (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                             inner join Hotel h on h.regionId = ?
                                             inner join Reservation res on res.hotelId=h.id
                where r.reservationId=res.id) as reviewScore,
               (select count(r.id) from Review r
                                            inner join Hotel h on h.regionId = ?
                                            inner join Reservation res on res.hotelId = h.id
                where r.reservationId=res.id) as reviewCount,
               h.subwayText,h.callingNumber, h.aboutHotel, h.facility, h.locatedAt
        from Hotel h
        where h.regionId=?;
    `;
    const [Rows] = await connection.query(Query, [id,id,id]);
    return Rows;
}
async function selectHotelId(connection, id) {
    const Query = `
            select h.id, h.level, h.name,
                   (select case when (CAST(avg(r.score) AS DECIMAL(3,2))) then CAST(avg(r.score) AS DECIMAL(3,2)) else '0.00' end from Review r
                                                 inner join Reservation res on res.hotelId=?
                    where r.reservationId=res.id) as reviewScore,
                   (select count(r.id) from Review r
                                                inner join Reservation res on res.hotelId=?
                    where r.reservationId=res.id) as reviewCount,
                   h.subwayText,h.callingNumber, h.aboutHotel, h.facility, h.locatedAt
            from Hotel h
            where h.id=?;
                `;
    const [Rows] = await connection.query(Query, [id,id,id]);
    return Rows;
}



async function selectCityId(connection, id) {
    const Query = `
                SELECT id,name
                FROM City 
                WHERE id = ?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectRegionId(connection, id) {
    const Query = `
                SELECT id,name
                FROM Region 
                WHERE id = ?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectCityName(connection, name) {
    const Query = `
                SELECT id,name
                FROM City 
                WHERE name = ?;
                `;
    const [Rows] = await connection.query(Query, name);
    return Rows;
}
async function selectRegionName(connection, name) {
    const Query = `
                SELECT id,name
                FROM Region 
                WHERE name = ?;
                `;
    const [Rows] = await connection.query(Query, name);
    return Rows;
}
async function selectHotelPhoto(connection, id) {
    const Query = `
        select hp.id as photoId,hp.text, hp.imageUrl from Hotel h
                                             inner join HotelPhoto hp on hp.hotelId=h.id
        where h.id = ?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}

async function selectHotelFacility(connection, id) {
    const Query = `
        select f.id as facilityId, fh.hotelId as hotelId, f.name, f.imageUrl from Facility f
        inner join FacilityHotel fh on fh.hotelId=?
        where f.id = fh.facilityId;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}

async function selectHotelSellerInfo(connection, id) {
    const Query = `
        select h.id, h.chiefName, h.hotelName, h.locatedAt, h.email, h.callingNumber, h.regNum from Hotel h where h.id=?;
    `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
module.exports = {
    selectHotel,
    selectHotelName,
    selectHotelCityId,
    selectHotelRegionId,
    selectHotelId,

    selectCityId,
    selectRegionId,
    selectRegionName,
    selectCityName,
    selectHotelPhoto,
    selectHotelFacility,
    selectHotelSellerInfo,

    selectCheckReservation,
    selectSearchHotel,
    selectHotelsByCityId,
    selectHotelsByRegionId,
    selectHotelsByName,
    selectHotelRecommend,
    selectHotelRecommend2,
    postWatch,
    checkWatch,
    updateWatch
};
