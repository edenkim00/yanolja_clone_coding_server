// 모든 유저 조회
async function selectCity(connection) {
  const Query = `
                SELECT id,name
                FROM City;
                `;
  const [Rows] = await connection.query(Query);
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


module.exports = {
  selectCityName,
  selectCity
};
