const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'database.ct6mccu0rrcp.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'qawsed0986',
    database: 'baemin'
});

module.exports = {
    pool: pool
};