//기본주소 http://localhost:3001/admin
//관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

var db = require('../models/index');



router.get('/list',async(req,res)=>{


    var searchOption = {
        dept_name:"0",
        admin_name:"",
        telephone:""
    }

    const admins = await db.Admin.findAll();

    res.render('admin/list',{admins,searchOption});
});


router.post('/list',async(req,res)=>{

        //step1: 사용자가 선택/입력한 조회옵션 데이터를 추출한다
        var dept_name = req.body.dept_name;
        var admin_name = req.body.admin_name;
        var telephone = req.body.telephone;
    
        var searchOption = {
            dept_name,
            admin_name,
            telephone
        }



        var admins = await db.Admin.findAll(
            {
                where:{
                    dept_name:searchOption.dept_name,
                    admin_name:searchOption.admin_name,
                    telephone:searchOption.telephone
                }
            }
        );


    res.render('admin/list',{admins,searchOption});
});







router.get('/create',async(req,res)=>{
    res.render('admin/create');
});


router.post('/create',async(req,res) => {

        //step1: 사용자가 입력한 게시글 등록 데이터 추출
        var dept_name =req.body.dept_name;
        var admin_id =req.body.admin_id;
        var admin_password =req.body.admin_password;
        var email =req.body.email;
        var admin_name =req.body.admin_name;
        var telephone =req.body.telephone;
        var used_yn_code =req.body.used_yn_code;

        var admin = {
            dept_name,
            admin_id,
            admin_password,
            email,
            admin_name,
            telephone,
            used_yn_code,
            reg_date:Date.now(),
            company_code:1,
            reg_user_id:1
        }

        //관리자 정보를 admin테이블에 저장하고 저장된 값을 다시 반환받는다
        await db.Admin.create(admin);


    res.redirect('/admin/list');
});








router.get('/delete', async (req,res) => {

    var articleIdx = req.query.amid;

    var deleteCnt = await db.Admin.destroy({where:{admin_member_id:articleIdx}});

    res.redirect('/admin/list');
});








router.get('/modify/:amid', async (req,res) => {

    var articleIdx = req.params.amid;


    var admin = await db.Admin.findOne({where:{admin_member_id:articleIdx}});

    res.render('admin/modify',{admin});
});



router.post('/modify/:amid', async (req,res) => {

    var articleIdx = req.params.amid;


    var dept_name =req.body.dept_name;
    var admin_id =req.body.admin_id;
    var admin_password =req.body.admin_password;
    var email =req.body.email;
    var admin_name =req.body.admin_name;
    var telephone =req.body.telephone;
    var used_yn_code =req.body.used_yn_code;

    var admin = {
        dept_name,
        admin_id,
        admin_password,
        email,
        admin_name,
        telephone,
        used_yn_code,
        reg_date:Date.now()
    }

    var updatedCount = await db.Admin.update(admin,{where:{admin_member_id:articleIdx}});

    res.redirect('/admin/list');
});







module.exports = router;