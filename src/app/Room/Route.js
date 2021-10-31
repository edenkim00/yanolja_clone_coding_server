module.exports = function(app){
    const room = require('./Controller');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)
    // 2. 유저 조회 API (+ 검색)
    app.get('/app/room',room.getRoom);
    app.get('/app/room/:roomId',room.getRoomId);
    app.get('/app/room/photo/:roomId',room.getRoomPhoto);
    // app.post('/app/review',hotel.postReview);


    // 3. 특정 유저 조회 API


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API