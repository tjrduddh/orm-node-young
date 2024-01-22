var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');

//패스포트 객체 참조
const passport = require('passport');

//로그인 여부 체크 사용자 권한 세션 미들웨어 참조하기
// const {isLoggedIn, isNotLoggedIn} = require('./sessionMiddleware');

const {isLoggedIn, isNotLoggedIn} = require('./passportMiddleware');

var db = require('../models/index');

/*
관리자 웹사이트 메인페이지 요청과 응답처리 라우팅 메소드
호출주소: http://localhost:3001/
*/
router.get('/',isLoggedIn, async (req, res, next) => {

  //현재 로그인한 사용자 세션 정보 추출하기
  //var admin_id = req.session.loginUser.admin_id;

  //패스포트 방식으로 생성된 세션정보 조회하기
  var loginUserData = req.session.passport.user;

  res.render('index',{loginUserData});
});


/*
기능: 관리자 웹사이트 메인페이지 요청과 응답처리 라우팅 메소드
호출주소: http://localhost:3001/login
*/
router.get('/login',isNotLoggedIn, async (req, res, next) => {
  res.render('login',{layout:false,resultMsg:"",loginError:req.flash('loginError')});
});

/*
기능: 관리자 웹사이트 로그인 처리 라우팅 메소드 - express-session 기반으로 구현
      로그인 완료시 서버세션정보를 생성하고 메인페이지로 이동한다
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
      //step4.0: 아이디/암호가 일치하는 사용자인 경우 해당 사용자의 주요정보를 세션에 저장한다.

      //서버에 메모리공간에 저장할 로그인한 현재 사용자의 세션정보 구조 및 데이터바인딩
      var sessionLoginData = {
        admin_member_id:member.admin_member_id,
        company_code:member.company_code,
        admin_id:member.admin_id,
        admin_name:member.admin_name
      }

      //req.session속성에 동적속성으로 loginUser라는 속성을 생성하고 값으로 세션 json값을 세팅
      req.session.loginUser = sessionLoginData;

      //관리자 로그인 여부 세션 속성 추가하기
      req.session.isLogined = true;

      //반드시req.session.save() 메소드를 호출해서 동적속성에 저장된 신규속성을 저장한다.
      //save() 호출과 동시에 쿠키파일이 서버에서 생성되고 생성된 쿠키파일이
      //현재 사용자 웹브라우저에 전달되어 저장된다.
      //저장된 쿠키파일은 이후 해당 사이트로 요청이 있을때마다 무조건 전달된다.
      //전달된 쿠키정보를 이용해 서버메모리상의 세션정보를 이용해 로그인한 사용자정보를 추출한다.
      req.session.save(function(){
        
        //step4.1:암호가 동일한 경우 메인페이지 이동하기
        res.redirect('/');

      })




    }else{
      //step4.2:암호가 다른 경우
      resultMsg = "암호가 일치하지 않습니다.";
      res.render('login',{resultMsg,layout:false});
    }
  }
});


//passport - 로컬인증전략을 통한 로그인 구현
router.post('/passportlogin', async (req, res, next) => {

  //패스포트 기반 인증처리 메소드 호출하기 authenticate()
  /*
  'local' 전략을 통해 passport폴더내 파일이 실행되고 done()값이 아래 콜백함수 값으로 넘어온다.
  authError: 어떤 에러가 발생했는지 넘어온다.
  user: 사용자의 아이디/암호 값이 추출되서 유효성 검사후 로그인 되는 경우 user에 세션정보가 저장된다
  info: 아이디나 암호가 틀린 경우 메시지를 전달하기위해 넘어온다
  */
  passport.authenticate('local', (authError, user, info) => {

    //인증에러 발생시
    if (authError) {
      console.error(authError);
      return next(authError); //app.js 전역예외처리기?를 통해 처리
    }

    //로그인 실패했다면
    if (!user) {
      //flash - redirect되는 페이지에 마지막 데이터를 일회성으로 전달할 수 있는 방법
      req.flash('loginError', info.message);
      return res.redirect('/login');
    }

    //정상적인 로그인이 완료된 경우 req.login(세션으로 저장할 데이터)
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      //정상 로그인시 메인페이지 이동
      return res.redirect('/');
    });

  })(req, res, next);

});



//사용자 로그아웃 처리 라우팅 메소드
//http://localhost:3001/logout
router.get('/logout',isLoggedIn,function(req,res,next){

  req.logout(function(err){

    if(err){
      return next(err);
    }

    //로그아웃하고 관리자 로그인 페이지로 이동 시키기
    req.session.destroy();
    res.redirect('/login');

  });

  //   req.logout(function(err){

  //   if(err){
  //     return next(err);
  //   }

  //   //로그아웃하고 관리자 로그인 페이지로 이동 시키기
  //   req.session.destroy();
  //   res.redirect('/login');
    
  // });


  // res.render('login')
});



module.exports = router;
