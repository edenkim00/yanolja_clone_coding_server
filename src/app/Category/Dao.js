// 모든 유저 조회
async function selectCategory(connection) {
  const Query = `
                SELECT id,name, imageUrl
                FROM Category;
                `;
  const [Rows] = await connection.query(Query);
  return Rows;
}




module.exports = {
  selectCategory
};
