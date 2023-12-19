//기본주소 http://localhost:3001
//공통기능 제공(관리자 사이트 로그인/메인-대시보드)
var express = require('express');
var router = express.Router();


router.get('/',async(req,res)=>{
  res.render('index');
});

/*
-관리자 웹사이트의 로그인 웹페이지를 제공하는 라우팅 메소드
-사용자 계정정보가 아닌 관리자 계정정보를 통한 로그인을 시도합니다
-http://localhost:3001/login
*/
router.get('/login',async(req,res)=>{
  res.render('login');
});


/*
-관리자 계정으로 로그인 성공 이후에 최초로 보여줄 관리자 웹사이트 메인페이지
-반드시 관리자 로그인 성공 후에 접속이 가능합니다
-http://localhost:3001/login
*/
router.post('/login',async(req,res)=>{
  res.render('index');
});



module.exports = router;
