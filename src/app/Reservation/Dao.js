// 모든 유저 조회

async function checkCoupon(connection, userId,couponId,date) {
    const selectUserIdQuery = `
        select cu.id as cuid, c.salePrice as salePrice from Coupon c
                                                                inner join CouponUser cu on cu.userId=? && cu.couponId=c.id && cu.status!='DELETED'
        where c.id=? && ? >= c.startDate && c.expiryDate >= ? && c.status!='DELETED';
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, [userId,couponId,date,date]);
    return userRow;
}
async function postRes(connection, params) {
    const selectUserIdQuery = `
        INSERT INTO Reservation(userId,roomId,hotelId,startTime,endTime,price,finalPrice,howtoPay,pointUse,userName,userphoneNumber,realuserName,realuserphoneNumber,howtoCome,couponId)
        VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?); 
    `;
    const [userRow] = await connection.query(selectUserIdQuery, params);
    return userRow;
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
async function selectRoomId(connection, roomId) {
    const selectUserIdQuery = `
                 SELECT id
                 FROM Room
                 WHERE id = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, roomId);
    return userRow;
}
async function selectUserInfo(connection, id){
    const Query = `
        SELECT u.phoneNumber,case when sum(changePoint) < 0 then 0 else sum(changePoint) end remainPoint
        FROM PointUse pu
                 inner join User u on pu.userId = u.id
        WHERE userId = ?;`;
    const [result] = await connection.query(Query,id);
    return result;
}
async function selectRoomInfo(connection, roomId,startTime,endTime){
    const Query = `
        select h.name as hotelName, r.name as roomName,
               concat(DATE_FORMAT(?,'%Y.%m.%d (%a) ~'),DATE_FORMAT(?,' %Y.%m.%d (%a)  |  '),DATEDIFF(?,?),'박') as dateInfo, r.text as checkinInfo
                ,r.priceafterSale as price
        from Room r
                 inner join Hotel h on h.id = r.hotelId
        where r.id=?;
        `;
    const [result] = await connection.query(Query,[startTime,endTime,endTime,startTime,roomId]);
    return result;
}


async function deleteCoupon(connection, cuid){
    const Query = `
        UPDATE CouponUser SET status = 'DELETED' WHERE id = ?;`;
    const [result] = await connection.query(Query,cuid);
    return result;
}
async function deleteCoupon(connection, cuid){
    const Query = `
        UPDATE CouponUser SET status = 'DELETED' WHERE id = ?;`;
    const [result] = await connection.query(Query,cuid);
    return result;
}
async function dateCheck(connection, roomid,startTime,endTime){
    const Query = `
        select id from Reservation res where res.roomId=? && res.startTime < ? && res.endTime > ?;`;
    const [result] = await connection.query(Query,[roomid,endTime,startTime]);
    return result;
}
module.exports = {
    selectRoomId,
    selectUserId,
    selectUserInfo,
    selectRoomInfo,
    postRes,
    checkCoupon,
    deleteCoupon,
    dateCheck
};
