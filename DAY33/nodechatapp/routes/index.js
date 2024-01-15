
//공통 페이지  제공(로그인,회원가입,암호찾기)

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

//db객체는 반드시 var나 let으로 선언필요
var db = require('../models/index');



// 사용자 웹사이트 로그인 페이지 요청 및 응답
// localhost:3000/
router.get('/',async(req,res)=>{


  res.render('login',{resultMsg:'',email:'',password:'',layout:"authLayout"});
});


//로그인 처리 요청 및 응답,로그인 완료 후 메인 페이지 이동처리
router.post('/',async(req,res)=>{


  var email = req.body.email;
  var password = req.body.password;

  

  var member = await db.Member.findOne({where:{email}});

  resultMsg = '';

  if(member == null){ 
    resultMsg = "동일한 메일주소가 존재하지 않습니다.";
  }else{

    if(member.member_password == password){
      res.redirect('/chat');
    }else{
      resultMsg = "암호가 일치하지 않습니다.";
    }
  }

  if(resultMsg !== ''){
    res.render('login',{resultMsg,layout:"authLayout"});
  }

  
});



// 회원가입 웹페이지 요청 및 응답
router.get('/entry',async(req,res)=>{
  res.render('entry',{layout:"authLayout"});
});


//회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
router.post('/entry',async(req,res)=>{

    //사용자가 입력한 정보 추출
    var email = req.body.email;
    var member_password = req.body.password;



    //DB 신규회원등록 처리
    var member = {
        email,
        member_password,
        name:"dhdudtjr"
    }  

    var savedMember = await db.Member.create(member);

  res.redirect('/');
});




// 암호 찾기 웹페이지 요청 및 응답
router.get('/find',async(req,res)=>{
  res.render('find',{resultMsg:'',email:'',layout:"authLayout"});
});


//암호찾기 처리 요청 및 응답,암호 찾기 완료 후 로그인 페이지 이동처리
router.post('/find',async(req,res)=>{

    var email = req.body.email;

    var member = await db.Member.findOne({where:{email}});


    var resultMsg = '';

    if(member == null){
      resultMsg = "등록된 이메일이 아닙니다.";
    }else{
      res.redirect('/');
    }

    if(resultMsg !== ''){
      res.render('find',{resultMsg});
    }



});



router.get('/makeJWT',async(req,res)=>{


  //토큰에 저장할 JSON데이터 생성
  var userData = {
    userNo:100,
    userId:"young",
    userName:"오영석",
    userEmail:"test5@test.co.kr",
    telephone:"010-5553-6666"
  };

  //step2:JSON데이터를 JWT토큰 문자열로 생성한다.
  //jwt.sign('JSON데이터', JWT인증키값: 만들때 해독할때 동일한 인증키를 사용해야함,옵션{토큰유효기간,생성자정보})
  const token = jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'24h', issuer:'dhdudtjr'})


  res.render('makeJWT',{token, layout:false});
});


//제공된 JWT토큰의 값을 해석해봅니다.
//localhost:3000/readJWT?token=asfageggqshrehwr / 쿼리스트링방식
router.get('/readJWT',async(req,res)=>{

  var token = req.query.token;

  //토큰에서 json데이터만 추출해보자
  //jwt.verify(“JWT토큰값”,”JWT토큰 생성시 사용한 동일한 인증키값”)
  var jsonData = jwt.verify(token,process.env.JWT_SECRET);

  console.log("추출된 JSON원본데이터: ",jsonData);


  res.render('readJWT',{jsonData, layout:false});
});



module.exports = router;
