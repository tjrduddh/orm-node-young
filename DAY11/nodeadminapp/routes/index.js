//기본주소 http://localhost:3001
//공통기능 제공(관리자 사이트 로그인/메인-대시보드)
var express = require('express');
var router = express.Router();


//로그인 후 접속할 메인 페이지 요청 및 응답
router.get('/', function(req, res, next) {
  res.render('index', { title: '메인페이지' });
});

// 로그인 웹페이지 요청 및 응답
router.get('/login',async(req,res)=>{
  res.render('login');
});


//로그인 처리 요청 및 응답,로그인 완료 후 메인 페이지 이동처리
router.post('/login',async(req,res)=>{
  res.redirect('/');
});



module.exports = router;
