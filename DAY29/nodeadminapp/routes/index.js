var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');

var db = require('../models/index');

/*
관리자 웹사이트 메인페이지 요청과 응답처리 라우팅 메소드
호출주소: http://localhost:3001/
*/
router.get('/', async (req, res, next) => {
  res.render('index');
});


/*
기능: 관리자 웹사이트 메인페이지 요청과 응답처리 라우팅 메소드
호출주소: http://localhost:3001/login
*/
router.get('/login', async (req, res, next) => {
  res.render('login',{layout:false,resultMsg:""});
});

/*
기능: 관리자 웹사이트 로그인 처리 라우팅 메소드
호출주소: http://localhost:3001/login
*/
router.post('/login', async (req, res, next) => {

  //step1: 사용자 입력 아이디/암호 추출하기
  var adminid = req.body.id;
  var adminPassword = req.body.password;

  //step2: 동일한 아이디 사용자 정보 조회하기
  var member = await db.Admin.findOne({where:{admin_id:adminid}});

  var resultMsg = '';

  if(member == null){
    resultMsg = "동일한 아이디가 존재하지 않습니다.";
    res.render('login',{resultMsg,layout:false});
  }else{

    //step3:사용자 암호 체크하기(db에 저장된 암호와 사용자가 입력한 암호 체크하기)
    //bcrypt를 이용한 암호체크: bvrypt.compare('로그인시 사용자가 입력한 암호값','db에 저장된 암호화된 값')
    var passwordResult = await bcrypt.compare(adminPassword,member.admin_password);


    if(passwordResult){
      //step4.1:암호가 동일한 경우 메인페이지 이동하기
      res.redirect('/');
    }else{
      //step4.2:암호가 다른 경우
      resultMsg = "암호가 일치하지 않습니다.";
      res.render('login',{resultMsg,layout:false});
    }
  }
});



module.exports = router;
