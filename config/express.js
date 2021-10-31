const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    require('../src/app/City/Route')(app);
    require('../src/app/Region/Route')(app);
    require('../src/app/Hotel/Route')(app);
    require('../src/app/Room/Route')(app);
    require('../src/app/Category/Route')(app);
    require('../src/app/SearchList/Route')(app);
    require('../src/app/Point/Route')(app);
    require('../src/app/Reservation/Route')(app);
    require('../src/app/Review/Route')(app);
    require('../src/app/Coupon/Route')(app);
    require('../src/app/Keep/Route')(app);
    require('../src/app/Advertising/Route')(app);

    // require('../src/app/Board/boardRoute')(app);

    return app;
};