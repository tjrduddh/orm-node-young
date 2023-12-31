
//공통 페이지  제공(로그인,회원가입,암호찾기)

var express = require('express');
var router = express.Router();

// /* 
// -채팅 웹페이지 요청 라우팅 메소드
// - http://localhost:3000/
// */
// router.get('/', async(req, res, next)=> {
//   res.render('chat/index');
// });


// 사용자 웹사이트 로그인 페이지 요청 및 응답
// localhost:3000/
router.get('/',async(req,res)=>{
  res.render('login',{layout:"authLayout"});
});


//로그인 처리 요청 및 응답,로그인 완료 후 메인 페이지 이동처리
router.post('/',async(req,res)=>{
  res.redirect('/chat');
});



// 회원가입 웹페이지 요청 및 응답
router.get('/entry',async(req,res)=>{
  res.render('entry');
});


//회원가입 처리 요청 및 응답,회원가입 완료 후 로그인 페이지 이동처리
router.post('/entry',async(req,res)=>{

    //사용자가 입력한 정보 추출
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var phone = req.body.phone;
    var birth = req.body.birth;

    //DB 신규회원등록 처리
    var member = {
        email,
        password,
        name,
        phone,
        birth,
        entryDate:Date.now()
    }

  res.redirect('/login');
});




// 암호 찾기 웹페이지 요청 및 응답
router.get('/find',async(req,res)=>{
  res.render('find');
});


//암호찾기 처리 요청 및 응답,암호 찾기 완료 후 로그인 페이지 이동처리
router.post('/find',async(req,res)=>{

    var email = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;

    var member = {
        email,
        name,
        phone,
        findDate:Date.now()
    }

  res.redirect('/login');
});



module.exports = router;
