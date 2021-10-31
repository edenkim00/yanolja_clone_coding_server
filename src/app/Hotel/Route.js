module.exports = function(app){
    const hotel = require('./Controller');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)
    // 2. 유저 조회 API (+ 검색)
    app.get('/app/hotel-search-keyword',hotel.getHotel);
    app.get('/app/hotel-search-region',hotel.getHotelRegionId);
    app.get('/app/hotel-search-lalng',hotel.getHotelLalng);

    app.get('/app/hotel/recommend',jwtMiddleware,hotel.recommend);
    app.post('/app/hotel-watch',jwtMiddleware,hotel.postuserWatch);

    app.get('/app/hotel/:hotelId',hotel.getHotelId);
    app.get('/app/hotel/photo/:hotelId',hotel.getPhoto);
    app.get('/app/hotel/facility/:hotelId',hotel.getFacility);
    app.get('/app/hotel/sellerinfo/:hotelId',hotel.getSellerInfo);
    // 3. 특정 유저 조회 API


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API