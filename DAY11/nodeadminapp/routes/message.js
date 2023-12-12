//기본주소 http://localhost:3001/message
//채팅 메시지 이력 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();


// router.get('/', async (req,res) => {
//     res.render('message/list');
// });


router.get('/list',async(req,res)=>{
    res.render('message/list');
});


router.get('/create',async(req,res)=>{
    res.render('message/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/message/list');
});


router.get('/modify', async (req,res) => {
    res.render('message/modify');
});


router.post('/modify', async (req,res) => {
    res.redirect('/message/list');
});


router.get('/delete', async (req,res) => {
    res.render('message/list');
});


module.exports = router;