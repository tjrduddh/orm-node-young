//기본주소 http://localhost:3001/channel
//채팅방 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();


// router.get('/', async (req,res) => {
//     res.render('channel/list');
// });


router.get('/list',async(req,res)=>{
    res.render('channel/list');
});


router.get('/create',async(req,res)=>{
    res.render('channel/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/channel/list');
});


router.get('/delete', async (req,res) => {
    res.render('channel/list');
});





router.post('/modify', async (req,res) => {
    res.redirect('/channel/list');
});




router.get('/modify/:mid', async (req,res) => {
    res.render('channel/modify');
});




module.exports = router;