const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const request = require("request");
const regexEmail = require("regex-email");
const axios = require("axios");
const {emit} = require("nodemon");
const crypto = require('crypto');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const nodemailer = require('nodemailer');
var accountSid = 'AC4ee04f92ba678ce4b14e0a37dc0fb3c2';
var authToken = 'a46775e31b9b19ca8190d43cb5c9538c';
var twilio = require('twilio');
var client = new twilio(accountSid,authToken);

var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var Base64 = require("crypto-js/enc-base64");

function send_message(phone ,user_auth_number) {
    var user_phone_number = phone;
    // var user_auth_number = Math.random().toString(36).slice(2);
    var resultCode = 404;
    const date = Date.now().toString();
    const uri = "ncp:sms:kr:271054712081:yanolja_b";
    const secretKey = "4fh2a4gHqkwdCpDmb0f81N1ORFbpNXiYEwCDw2On";
    const accessKey = "VtGLHmWrNekjm0A5UHvd";
    const method = "POST"; const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    console.log(`인증번호 ${user_auth_number} 입니다.`);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    request( { method: method, json: true, uri: url, headers:
            { "Contenc-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature, },
        body: { type: "SMS", countryCode: "82",
            from: "01027290986",
            content: `[야놀자_b] 인증번호는 [${user_auth_number}] 입니다.`,
            messages: [ { to: `${user_phone_number}`, }, ], }, },
        function (err, res, html) {
        if (err) console.log(err);
        else { resultCode = 200; console.log(html); } } );
    return resultCode;
};
passport.use('kakao',new KakaoStrategy({
        clientID: '576388838589387934711ab6c3cb04aa',
        callbackURL : 'https://dev.strangeunoia.shop/app/kakaologin/callback',},
    async (accessToken, refreshToken, profile, done)=> {
        console.log(accessToken);
        console.log(profile);
        const email = profile._json.kakao_account.email;
        console.log(email);
        const result = await userProvider.retrieveUserList(email);
        if(result.length>0)
            return done(JSON.stringify(response(baseResponse.SUCCESS,{"accessToken":accessToken})));
        else return done(JSON.stringify(errResponse(baseResponse.KAKAO_FAIL))); // 7014
}));
exports.kakaologin = passport.authenticate('kakao');

exports.kakaologinAccess = async function(req,res){
    const {accessToken} = req.body;
    let kakao_profile;
    kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    });
    const email = kakao_profile.data.kakao_account.email;
    const result = await userProvider.retrieveUserList(email);
    const signInResponse = await userService.postSignIn(result[0].email, result[0].password,true);

    return res.send(signInResponse);
};
// exports.kakaologincallback = async function (req, res){
//     console.log(req);
//     try {
//         // res.redirect('https://strangeunoia.shop/app/users');
//         console.log(req.accessToken, req.profile);
//         // console.log(req);
//         return res.send(response(baseResponse.SUCCESS));
//         // res.redirect('https://dev.strangeunoia.shop/app/kakaologin');
//
//     }catch(err){
//         logger.error(`App - kakaologin Service error\n: ${err.message}`);
//         return errResponse(baseResponse.KAKAOLOGIN_ERROR);
//     }
// };
/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {


    const {email, password, phoneNumber} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        phoneNumber
    );

    return res.send(signUpResponse);
};

// 비밀번호찾기용
exports.emailvalidation = async function (req, res) {
    const email = req.body.email;
    let authNum = Math.random().toString().substr(2,6);
    if(!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    else {
        const userListByEmail = await userProvider.retrieveUserList(email);
        if (userListByEmail.length < 1) {
            return res.send(errResponse(baseResponse.SIGNIN_EMAIL_WRONG));
        }
        const smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "eotjd0986@gmail.com",
                pass: "qawsed0@"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: "eotjd0986@gmail.com",
            to: email,
            subject: "이메일 인증 (야놀자 B)",
            text: "이메일 인증 코드 : " + authNum
        };
        await smtpTransport.sendMail(mailOptions, (error, responses) => {
            if (error) {
                res.json({msg: 'error occur'});
            } else {
                res.send(response(baseResponse.SUCCESS, {"validationCode ": authNum}));
            }
            smtpTransport.close();
        });
    }
};

//회원가입용
exports.phonevalidation = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
    //validation
    if(!phoneNumber) return res.send(response(baseResponse.PHONENUMBER_EMPTY));
    const phonenum = phoneNumber.substr(0,3) + phoneNumber.substr(4,4) + phoneNumber.substr(9,4);
    if(phoneNumber.length != 13 || isNaN(phonenum)){
        return res.send(response(baseResponse.PHONENUMBER_FORMAT_ERROR));
    }
    console.log(phonenum);
    let authNum = Math.random().toString().substr(2,6);
    send_message(phonenum,authNum);
    res.send(response(baseResponse.SUCCESS, {"validationCode ": authNum}));
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        if (userListByEmail.length < 1){
            return res.send(errResponse(baseResponse.SIGNIN_EMAIL_WRONG));}
        else
            return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userIdFromJWT = req.verifiedToken.userId;
    if(userId != userIdFromJWT) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); //2016

    const userByUserId = await userProvider.retrieveUser(userId);

    if(!userByUserId){
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    }
    const result = await userProvider.selectUserStatus(userId);
    if(result['status']=='DELETED'){
        return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));
    }

    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password,false);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    const result = await userProvider.selectUserStatus(userId);
    if(result['status']=='DELETED'){
        return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));
    }
    else {
        if(!phoneNumber && !nickname && !password){
            return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
        }
        const editUserInfo = await userService.editUser(userId, nickname, password, phoneNumber);
        return res.send(editUserInfo);
    }
};
exports.deleteUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    else {
        const editUserInfo = await userService.deleteUser(userId);
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
