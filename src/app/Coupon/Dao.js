// 모든 유저 조회
async function selectCouponCode(connection, code) {
    const selectUserIdQuery = `
                 SELECT id, couponCode 
                 FROM Coupon
                 WHERE couponCode = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, code);
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

async function selectPointUser(connection, userId) {
    const selectUserIdQuery = `
        SELECT case when sum(changePoint) < 0 then 0 else sum(changePoint) end remainPoint
        FROM PointUse
        WHERE userId = 1;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}
async function postCoupon(connection, params) {
    const selectUserIdQuery = `
        INSERT INTO CouponUser(userId, couponId)
        VALUES (?, ?); 
    `;
    const [userRow] = await connection.query(selectUserIdQuery, params);
    return userRow;
}

async function selectCouponCount(connection, userId) {
    const selectUserIdQuery = `
        select count(c.id) as couponCount from Coupon c inner join CouponUser cu on cu.userId=? where c.id=cu.couponId;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow[0]["couponCount"];
}
async function selectCouponUserId(connection,userId){
    const selectUserIdQuery = `
        select c.id as couponId,c.name, c.salePrice,c.imageUrl, concat(DATE_FORMAT(c.startDate,'%Y.%m.%d ~ '), DATE_FORMAT(c.expiryDate,'%Y.%m.%d')) as validDate,
               DATE_FORMAT(TIMEDIFF(c.expiryDate,CURRENT_DATE),'%d일 %h시간 %m분 남음') as remainTime, c.text from Coupon c
                                                                                                                 inner join CouponUser cu on cu.userId = 1 && cu.status != 'DELETED'
        where c.id=cu.couponId;`;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}


module.exports = {
    selectPointUser,
    selectUserId,
    postCoupon,
    selectCouponCode,
    selectCouponCount,
    selectCouponUserId
};
