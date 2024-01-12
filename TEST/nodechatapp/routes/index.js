
//공통 페이지  제공(로그인,회원가입,암호찾기)

var express = require('express');
var router = express.Router();


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
  res.render('entry');
});


//회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
router.post('/entry',async(req,res)=>{

    //사용자가 입력한 정보 추출
    var email = req.body.email;
    var member_password = req.body.password;
    var name = req.body.name;


    //DB 신규회원등록 처리
    var member = {
        email,
        member_password,
        name
    }  

    var savedMember = await db.Member.create(member);

  res.redirect('/');
});




// 암호 찾기 웹페이지 요청 및 응답
router.get('/find',async(req,res)=>{
  res.render('find',{resultMsg:'',email:'',layout:"layout"});
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



module.exports = router;
