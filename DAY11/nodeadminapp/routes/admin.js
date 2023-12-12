//기본주소 http://localhost:3001/admin
//관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();


//http://localhost:3001/member 이 주소를 쓰고 싶을때 ejs파일을 새로 만들어 보여주거나
//list.ejs로 보여주거나 하면 됩니다.
// router.get('/', async (req,res) => {
//     res.render('admin/list');
// });


router.get('/list',async(req,res)=>{
    res.render('admin/list');
});


router.get('/create',async(req,res)=>{
    res.render('admin/create');
});


router.post('/create',async(req,res) => {
    res.redirect('/admin/list');
});


router.get('/modify', async (req,res) => {
    res.render('admin/modify');
});


router.post('/modify', async (req,res) => {
    res.redirect('/admin/list');
});


router.get('/delete', async (req,res) => {
    res.render('admin/list');
});


module.exports = router;