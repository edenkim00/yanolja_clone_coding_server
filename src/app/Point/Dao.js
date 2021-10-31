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
async function postChange(connection, params) {
    const selectUserIdQuery = `
        INSERT INTO PointUse(userId, changePoint,text1,text2)
        VALUES (?, ?,?,?); 
    `;
    const [userRow] = await connection.query(selectUserIdQuery, params);
    return userRow;
}
module.exports = {
    selectPointUser,
    selectwillbeExpiredPoint,
    selectPointChangelist,
    selectUserId,
    postChange
};
