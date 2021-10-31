// 모든 유저 조회
async function selectRegion(connection) {
  const Query = `
                SELECT id,name, cityId
                FROM Region;
                `;
  const [Rows] = await connection.query(Query);
  return Rows;
}


async function selectRegionName(connection, name) {
  const Query = `
                SELECT id, name, cityId
                FROM Region 
                WHERE name = ?;
                `;
  const [Rows] = await connection.query(Query, name);
  return Rows;
}

async function selectRegionCityId(connection, id) {
    const Query = `
                SELECT id,name, cityId
                FROM Region 
                WHERE cityId = ?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}

async function selectCityId(connection, id) {
    const Query = `
                SELECT id,name
                FROM City 
                WHERE id = ?;
                `;
    const [Rows] = await connection.query(Query, id);
    return Rows;
}

module.exports = {
    selectRegion,
    selectRegionName,
    selectRegionCityId,
    selectCityId
};
