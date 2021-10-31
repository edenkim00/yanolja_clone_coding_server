// 모든 유저 조회
async function postReview(connection,params) {
    // userId, keyword, startTime, endTime, adult, child
    const Query = `
      INSERT INTO Review(reservationId,kindScore,cleanScore,convenienceScore,goodsScore,score,text)
      VALUES (?, ?, ?,?,?,?,?);
                `;
    const [Rows] = await connection.query(Query,params);
    return Rows;
}
async function postPhoto(connection,params) {
    // userId, keyword, startTime, endTime, adult, child
    const Query = `
      INSERT INTO ReviewPhoto(reviewId,imageUrl)
      VALUES (?, ?);
                `;
    const [Rows] = await connection.query(Query,params);
    return Rows;
}
async function getResInfo(connection, id){
    const Query = `select * from Reservation where id=?;`;
    const [Rows] = await connection.query(Query,id);
    return Rows;
}
async function getReviewResId(connection, id){
    const Query = `select * from Review where reservationId=? && Review.status !='DELETED';`;
    const [Rows] = await connection.query(Query,id);
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



async function getHotelId(connection, id){
    const Query = `select * from Hotel where id=?;`;
    const [result] = await connection.query(Query,id);
    return result;
}

async function selectReviewIdHotelId(connection, id) {
    const selectUserIdQuery = `
        select h.id as hotelId, count(rv.id) as reviewCount, round(avg(rv.score),1) as totalScore , 
              round(avg(rv.kindScore),1) as kindScore, round(avg(rv.cleanScore),1) as cleanScore
             ,round(avg(rv.convenienceScore),1) as convenienceScore,round(avg(rv.goodsScore),1) as goodsScore,group_concat(rv.id) as reviewId from Hotel h
           inner join Reservation res on res.hotelId = h.id
           inner join Review rv on rv.reservationId=res.id && rv.status!='DELETED'
        where h.id = ? group by h.id;
                 `;
    const [Row] = await connection.query(selectUserIdQuery, id);
    return Row;
}
async function selectReviewIdUserId(connection ,id){
    const selectUserIdQuery = `
        select r.id from Review r
             inner join User u on u.id=1
             inner join Reservation res on res.userId=u.id
        where r.reservationId=res.id && r.status!='DELETED';
                 `;
    const [Row] = await connection.query(selectUserIdQuery, id);
    return Row;
}
async function selectReviewReviewId(connection, id) {
    const selectUserIdQuery = `
        select r.id as reviewId,case when (r.score >= 3.0) then "https://dogruzi.ru/public/zopicvod9f7b.jpg"
                    else "https://image.shutterstock.com/image-vector/emoticon-sad-face-cute-isolated-600w-1431245366.jpg" end imageUrl, r.score, u.nickname as userNickname, Room.name as roomName, 
               DATE_FORMAT(r.createdAt,'%Y.%m.%d') as createdAt, r.text
        from Review r
                 inner join Reservation res on res.id = r.reservationId
                 inner join User u on res.userId = u.id
                 inner join Room on Room.id = res.roomId
        where r.id=? && r.status!='DELETED';
                 `;
    const [Row] = await connection.query(selectUserIdQuery, id);
    return Row;
}

async function selectReviewCommentReviewId(connection, id) {
    const selectUserIdQuery = `
        select c.id as commentId, c.reviewId, c.writer, DATE_FORMAT(c.createdAt,'%Y.%m.%d') as createdAt, c.text from ReviewComment c where reviewId=? && c.status != 'DELETED';
                 `;
    const [Row] = await connection.query(selectUserIdQuery, id);
    return Row;
}
async function selectReviewPhoto(connection, id){
    const Query = `select rp.id as photoId,rp.imageUrl from ReviewPhoto rp where rp.reviewId = ?;`;
    const [Row] = await connection.query(Query, id);
    return Row;
}
async function selectUserReviewId(connection, id){
    const Query = `select u.id from User u
                                        inner join Review r on r.id=?
                                        inner join Reservation res on res.id=r.reservationId
                   where u.id=res.userId;`;
    const [Row] = await connection.query(Query, id);
    return Row;
}

async function deleteReview(connection, id){
    const Query = `
        UPDATE Review SET status = 'DELETED' WHERE id = ?;`;
    const [result] = await connection.query(Query,id);
    return result;
}
async function changeReviewText(connection, id,text){
    const Query = `
        UPDATE Review SET text = ? WHERE id = ?;`;
    const [result] = await connection.query(Query,[text,id]);
    return result;
}
async function changeReviewPhoto(connection, id,text){
    const Query = `
        UPDATE ReviewPhoto SET imageUrl = ? WHERE id = ?;`;
    const [result] = await connection.query(Query,[text,id]);
    return result;
}
async function deleteReviewPhoto(connection, id){
    const Query = `
        UPDATE ReviewPhoto SET status = 'DELETED' WHERE id = ?;`;
    const [result] = await connection.query(Query,id);
    return result;
}
async function selectPhotoReviewPhotoId(connection,id){
    const Query = `select * from ReviewPhoto where id = ? && status !='DELETED'`;
    const [result] = await connection.query(Query,id);
    return result;
}
module.exports = {
    selectUserId,
    getResInfo,
    getReviewResId,
    postReview,
    getHotelId,
    selectReviewIdHotelId,
    selectReviewReviewId,
    selectReviewCommentReviewId,
    selectReviewPhoto,
    selectReviewIdUserId,
    selectUserReviewId,
    deleteReview,
    changeReviewText,
    selectPhotoReviewPhotoId,
    changeReviewPhoto,
    deleteReviewPhoto,
    postPhoto
};
