//기본주소 http://localhost:3001/member
//사용자 계정 정보(사용자 사이트에서 가입한 사용자정보) 관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

//http://localhost:3001/member 이 주소를 쓰고 싶을때 ejs파일을 새로 만들어 보여주거나
//list.ejs로 보여주거나 하면 됩니다.
// router.get('/', async (req,res) => {
//     res.render('member/list');
// });


router.get('/list',async(req,res)=>{
    res.render('member/list');
});


router.get('/create',async(req,res)=>{
    res.render('member/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/member/list');
});


router.get('/modify', async (req,res) => {
    res.render('member/modify');
});


router.post('/modify', async (req,res) => {
    res.redirect('/member/list');
});


router.get('/delete', async (req,res) => {
    res.render('member/list');
});


module.exports = router;