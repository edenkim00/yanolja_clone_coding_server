module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "권한이 없습니다! 유저 아이디(jwt) 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2019, "message": "휴대폰 번호 입력이 필요합니다." },
    PHONENUMBER_FORMAT_ERROR : { "isSuccess": false, "code": 2020, "message": "휴대폰 번호를 010-1234-5678 형식으로 보내주세요." },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "존재하지 않는 이메일(유저) 입니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

    CITY_ID_WRONG : { "isSuccess" : false, "code":5001,"message": "잘못된 cityid입니다."},
    REGION_ID_WRONG : { "isSuccess" : false, "code":5002,"message": "잘못된 regionid입니다."},

    HOTEL_NOT_EXIST :  { "isSuccess" : false, "code":6000,"message": "존재하는 숙박시설이 없습니다."},
    ROOM_ID_NOT_EXIST : { "isSuccess" : false, "code":6001,"message": "존재하지 않는 방id입니다."},
    NOT_KEYWORD : { "isSuccess" : false, "code":6002,"message": "검색할 keyword를 확인해 주세요."},
    QUERYSTRING_NOT_EXIST : { "isSuccess" : false, "code":6003,"message": "쿼리스트링이 적절하지 않습니다."},
    AVAILABLE_HOTEL_NOT_EXIST : { "isSuccess" : false, "code":6004,"message": "가능한 숙박시설이 없습니다."},
    REDUNDANT_BODY :  { "isSuccess" : false, "code":6005,"message": "Body가 적절하지 않습니다."},

    SEARCH_NOT_EXIST :  { "isSuccess" : false, "code":7001,"message": "잘못된 SEARCH ID"},
    USER_SEARCH_HOTEL_EMPTY : { "isSuccess" : false, "code":7002,"message": "호텔을 검색한 적 없는 user라 추천할 것이 없습니다."},
    REDUNDANT_POINT_USE : { "isSuccess" : false, "code":7003,"message": "잔여 포인트가 넉넉치 않습니다."},
    ALREADY_EXIST_REVIEW : { "isSuccess" : false, "code":7004,"message": "이미 등록된 리뷰가 있습니다."},
    RESERVATION_NOT_EXIST : { "isSuccess" : false, "code":7005,"message": "잘못된 예약id입니다."},
    REVIEW_NOT_EXIST : { "isSuccess" : false, "code":7006,"message": "리뷰가 없습니다."},
    REVIEW_PHOTO_NOT_EXIST : { "isSuccess" : false, "code":7007,"message": "리뷰 사진이 없습니다."},
    REDUNDANT_COUPON : { "isSuccess" : false, "code":7008,"message": "유효한 쿠폰 코드가 아닙니다."},
    ALREADY_REGISTER_COUPON : { "isSuccess" : false, "code":7009,"message": "이미 등록되어 있습니다."},
    CANNOT_USE_COUPON : { "isSuccess" : false, "code":7010,"message": "사용불가 쿠폰입니다."},
    ALREADY_FULL_ROOM : { "isSuccess" : false, "code":7011,"message": "해당 날짜에 이미 방이 꽉차있습니다."},
    PRICE_FINAL_NOT_MATCH : { "isSuccess" : false, "code":7012,"message": "finalPrice와 price의 차이가 쿠폰적용 내역과 포인트 사용 내역의 합과 다릅니다."},
    KEEP_NOT_EXIST : { "isSuccess" : false, "code":7013,"message": "해당 유저는 찜 호텔이 존재하지 않거나 해당 날짜에 맞는 호텔이 존재하지 않습니다."},
    KAKAO_FAIL :  { "isSuccess" : false, "code":7014,"message": "카카오 로그인과 연동된 해당 계정이 없습니다."},
}
