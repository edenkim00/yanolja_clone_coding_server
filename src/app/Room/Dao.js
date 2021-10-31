// 모든 유저 조회


async function selectHotelName(connection, name) {
  const Query = `
      select h.id, h.level, h.name,
             (select avg(r.score) from Review r
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

async function selectHotelId(connection, id) {
    const Query = `
            select h.id, h.level, h.name,
                   (select avg(r.score) from Review r
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

async function selectRoomHotelId(connection, id) {
    const Query = `
        select  r.id,hp.imageUrl, r.name, r.inclusion,  concat('기준 인원 ',r.standardNumber,'명 / 최대 ', r.maxNumber,'명') as personnel, r.kindText, r.pricebeforeSale as pricebeforeSale, r.saleRate, r.priceafterSale from Room r
            left outer join HotelPhoto hp on hp.imageUrl = (select hp.imageUrl from HotelPhoto hp where hp.roomId = r.id limit 1)
        where r.hotelId=?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectRoomHotelName(connection, name) {
    const Query = `
        select  r.id,hp.imageUrl, r.name, r.inclusion, concat('기준 인원 ',r.standardNumber,'명 / 최대 ', r.maxNumber,'명') as personnel, r.kindText, r.pricebeforeSale as pricebeforeSale, r.saleRate, r.priceafterSale from Hotel h
            inner join Room r on r.hotelId = h.id
            left outer join HotelPhoto hp on hp.imageUrl = (select hp.imageUrl from HotelPhoto hp where hp.roomId = r.id limit 1)
        where h.name=?;
                `;
    const [Rows] = await connection.query(Query, name);
    return Rows;
}
async function selectRoomId(connection, id) {
    const Query = `
        select r.id, r.name, r.inclusion, concat('기준 인원 ',r.standardNumber,'명(최대 ', r.maxNumber,'명)') as personnel, h.name as hotelName, h.callingNumber as hotelcallingNumber,
               r.text, r.pricebeforeSale, r.saleRate, r.priceafterSale, r.info, r.reservationInfo, r.cancelInfo, '예약가능' as isAlreadyFull from Room r
                inner join Hotel h on h.id= r.hotelId
        where r.id=1;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectRoomAlreadyFull(connection, id) {
    const Query = `
        select r.id, r.name, r.inclusion, concat('기준 인원 ',r.standardNumber,'명(최대 ', r.maxNumber,'명)') as personnel, h.name as hotelName, h.callingNumber as hotelcallingNumber,
               r.text, r.pricebeforeSale, r.saleRate, r.priceafterSale, r.info, r.reservationInfo, r.cancelInfo, '예약마감' as isAlreadyFull from Room r
                inner join Hotel h on h.id= r.hotelId
        where r.id=1;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectRoomPhoto(connection, id) {
    const Query = `
        select hp.id as photoId, hp.imageUrl from HotelPhoto hp where hp.roomId=?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}
async function selectRoomRes(connection, id,startTime,endTime) {
    const Query = `
        select * from Reservation r where ( endTime > ? && startTime < ? ) && r.roomId=?;
                `;
    const [Rows] = await connection.query(Query, [startTime,endTime,id]);
    return Rows;
}

module.exports = {
    selectHotelName,
    selectHotelId,
    selectRoomHotelName,
    selectRoomHotelId,
    selectRoomId,
    selectRoomPhoto,
    selectRoomRes,
    selectRoomAlreadyFull

};
