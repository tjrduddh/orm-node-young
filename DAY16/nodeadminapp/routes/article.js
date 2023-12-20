//기본주소 http://localhost:3001/article
//게시글 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();




router.get('/list',async(req,res)=>{
    res.render('article/list');
});


router.get('/create',async(req,res)=>{
    res.render('article/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/article/list');
});


router.get('/modify', async (req,res) => {
    res.render('article/modify');
});


router.post('/modify', async (req,res) => {
    res.redirect('/article/list');
});


router.get('/delete', async (req,res) => {
    res.render('article/list');
});


module.exports = router;