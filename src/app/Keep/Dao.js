// 모든 유저 조회
async function selectwillbeExpiredPoint(connection, userId) {
    const selectUserIdQuery = `
        SELECT case when (count(changePoint)=0) || sum(changePoint)<0 then 0 else sum(changePoint) end willbeexpiredPoint
        FROM PointUse
        WHERE userId =? && expiryDate && DATE_ADD(NOW(),INTERVAL 15 DAY) > PointUse.expiryDate && PointUse.expiryDate>Now();
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow[0];
}
async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
                 SELECT profileimageUrl, nickname, email, password, phoneNumber
                 FROM User
                 WHERE id = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}

async function selectPointUser(connection, userId) {
    const selectUserIdQuery = `
        SELECT case when sum(changePoint)<0 || (count(changePoint)=0) then 0 else sum(changePoint) end remainPoint
        FROM PointUse
        WHERE userId = ? && (changePoint<0 || Now()<expiryDate);

    `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow[0];
}
async function selectPointChangelist(connection, userId) {
    const selectUserIdQuery = `
        select text1,text2, changePoint, DATE_FORMAT(expiryDate,'~ %Y.%m.%d 까지') as expiryDate,DATE_FORMAT(createdAt,'%Y-%m-%d') as createdAt from PointUse where userId=?;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}
async function selectHotelId(connection, id) {
    const selectUserIdQuery = `
        select * from Hotel where id=?;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, id);
    return userRow;
}
async function selectKeep(connection, params) {
    const selectUserIdQuery = `
        select * from Keep where userId=? && hotelId=?;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, params);
    return userRow;
}
async function postKeep(connection, params) {
    const selectUserIdQuery = `
        insert into Keep(userId,hotelId) VALUES (?,?);
    `;
    const [userRow] = await connection.query(selectUserIdQuery, params);
    return userRow;
}
async function activateKeep(connection, id) {
    const selectUserIdQuery = `
        UPDATE Keep SET status = 'Active' WHERE id = ?;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, id);
    return userRow;
}
async function deleteKeep(connection, id) {
    const selectUserIdQuery = `
        UPDATE Keep SET status = 'DELETED' WHERE id = ?;`;
    const [userRow] = await connection.query(selectUserIdQuery,id);
    return userRow;
}

async function selectHotelsByUserId(connection, id){
    const Query = `
        select r.id as roomid, h.id as hotelid, r.maxNumber as maxnum from Hotel h
               inner join Room r on r.hotelId=h.id
               inner join Keep k on k.userId=?
        where h.id=k.hotelId;`;
    const [Rows] = await connection.query(Query, id);
    return Rows;
};
async function selectCheckReservation(connection, id,startTime,endTime){
    const Query = `
        select * from Reservation r
        where (endTime > ? && startTime < ? && r.roomId =?);
        `;
    const [Rows] = await connection.query(Query, [startTime,endTime,id]);
    return Rows;
};
async function selectSearchHotel(connection, roomid,hotelid) {
    const Query = `
        select h.id , hp.imageUrl, h.name,
               (select avg(r.score) from Review r
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
};
module.exports = {
    selectPointUser,
    selectwillbeExpiredPoint,
    selectPointChangelist,
    selectUserId,
    selectHotelId,
    selectKeep,
    postKeep,
    activateKeep,
    deleteKeep,
    selectHotelsByUserId,
    selectCheckReservation,
    selectSearchHotel
};
