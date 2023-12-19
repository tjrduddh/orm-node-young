//기본주소 http://localhost:3001/member
//사용자 계정 정보(사용자 사이트에서 가입한 사용자정보) 관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();



//회원목록 웹페이지 요청 라우팅 메소드
router.get('/list',async(req,res)=>{
    res.render('member/list');
});

//회원정보조회 처리 라우팅 메소드
router.post('/list',async(req,res)=>{
    res.render('member/list');
});

//회원 정보 신규등록을 위한 웹페이지 요청 라우팅메소드
router.get('/create',async(req,res)=>{
    res.render('member/create');
});

//신규 사용자가 입력한 회원가입정보를 받아 정보를 추출해 DB에 반영처리하는 라우팅메소드
router.post('/create',async(req,res) => {
    res.redirect('/member/list');
});



router.get('/delete', async (req,res) => {

    var articleIdx = req.query.mid;

    res.redirect('/member/list');
});








//회원정보 확인 및 수정 웹페이지 요청 라우팅메소드
router.get('/modify/:mid', async (req,res) => {
    res.render('member/modify');
});





//회원정보 수정처리 라우팅 메소드
router.post('/modify/:mid', async (req,res) => {
    res.redirect('/member/list');
});






module.exports = router;