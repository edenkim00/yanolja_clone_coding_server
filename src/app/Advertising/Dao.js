// 모든 유저 조회
async function selectAd(connection) {
  const Query = `
                SELECT id,imageUrl,text
                FROM Advertising;
                `;
  const [Rows] = await connection.query(Query);
  return Rows;
}




module.exports = {
  selectAd
};
