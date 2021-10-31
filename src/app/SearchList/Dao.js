// 모든 유저 조회

async function postRecord(connection,params) {
    // userId, keyword, startTime, endTime, adult, child
  const Query = `
      INSERT INTO SearchList(userId, keyword, startTime, endTime, adult, child)
      VALUES (?, ?, ?,?,?,?);
                `;
  const [Rows] = await connection.query(Query,params);
  return Rows;
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
async function selectSearchList(connection, id){
    const Query = `select s.id,s.keyword, concat(DATE_FORMAT(s.startTime,'%y.%m.%d(%a)~'),DATE_FORMAT(s.endTime,'%y.%m.%d(%a)')) as whenDate,
       concat(TIMESTAMPDIFF(DAY, s.startTime, s.endTime),'박',TIMESTAMPDIFF(DAY, s.startTime, s.endTime)+1,'일') as duration, s.adult,s.child
       from SearchList s where s.userId=? && s.status='Active';`
    const [result] = await connection.query(Query,id);
    return result;
}
async function selectSearchListId(connection, id){
    const Query = `select s.id,s.keyword, s.userId
       from SearchList s where s.id=? && s.status='Active';`;
    const [result] = await connection.query(Query,id);
    return result[0];
}
async function deleteRecord(connection, id){
    const Query = `
        UPDATE SearchList SET status = 'DELETED' WHERE id = ?;`;
    const [result] = await connection.query(Query,id);
    return result;
}
async function deleteAll(connection, userId){
    const Query = `
        UPDATE SearchList SET status = 'DELETED' WHERE userId = ?;`;
    const [result] = await connection.query(Query,userId);
    return result;
}

module.exports = {
    postRecord,
    selectUserId,
    selectSearchList,
    selectSearchListId,
    deleteRecord,
    deleteAll,
};
