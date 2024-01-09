var express = require('express');
var router = express.Router();


/*임시메인 */
router.get('/', function(req, res, next) {
  res.render('channel/chat',{layout:"baseLayout"});
  //res.render('channel/chat',{layout:"fales"});
});




/* 회원가입 웹페이지 요청과 응답 */
router.get('/entry', function(req, res, next) {
  res.render('entry');
});


/* 회원가입 사용자 입력정보 요청과 응답 */
router.post('/entry', function(req, res, next) {

  //step1: 회원가입페이지에서 사용자가 입력한 회원정보 추출
  var email = req.body.email;
  var password = req.body.password;

  //step2: db 신규 회원등록처리


  //등록완료시 로그인 페이지로 이동시키기
  res.redirect('/login');
});






/* 로그인 웹페이지 요청과 응답 */
router.get('/login', function(req, res, next) {
  res.render('login');
});


/* 로그인 사용자 입력정보 요청과 응답 */
router.post('/login', function(req, res, next) {
  res.redirect('/chat');
});







/* 암호찾기 웹페이지 요청과 응답 */
router.get('/find', function(req, res, next) {
  res.render('find');
});


/* 암호찾기 사용자 입력정보 요청과 응답 */
router.post('/find', function(req, res, next) {
  res.render('find',{email:"",result:"OK"}); 
});





module.exports = router;
