//기본주소 http://localhost:3001/admin
//관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();



router.get('/list',async(req,res)=>{


    var searchOption = {
        dept_name:"0",
        admin_name:"",
        telephone:""
    }

    const admins = [
        {
            admin_member_id:1,
            company_code:1,
            admin_id:"young",
            admin_password:1234,
            admin_name:"천재1호",
            email:"young@test.com",
            telephone:"010-1111-2222",
            dept_name:1,
            used_yn_code:"이용중",
            reg_user_id:1,
            reg_date:Date.now(),
            edit_user_id:1,
            edit_date:Date.now()
        }
    ];

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


        const admins = [
            {
                admin_member_id:1,
                company_code:1,
                admin_id:"young",
                admin_password:1234,
                admin_name,
                email:"young@test.com",
                telephone,
                dept_name,
                used_yn_code:"이용중",
                reg_user_id:1,
                reg_date:Date.now(),
                edit_user_id:1,
                edit_date:Date.now()
            }
        ];


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
            reg_date:Date.now()
        }


    res.redirect('/admin/list');
});



router.get('/delete', async (req,res) => {

    var articleIdx = req.query.mid;

    res.redirect('/admin/list');
});






router.get('/modify/:mid', async (req,res) => {

    var articleIdx = req.params.mid;


    var admin = {
        admin_member_id:articleIdx,
        company_code:1,
        admin_id:"young",
        admin_password:1234,
        admin_name:"천재1호",
        email:"young@test.com",
        telephone:"010-1111-2222",
        dept_name:1,
        used_yn_code:"이용중",
        reg_user_id:1,
        reg_date:Date.now(),
        edit_user_id:1,
        edit_date:Date.now()
    }

    res.render('admin/modify',{admin});
});



router.post('/modify/:mid', async (req,res) => {

    var articleIdx = req.params.mid;


    var dept_name =req.body.dept_name;
    var admin_id =req.body.admin_id;
    var admin_password =req.body.admin_password;
    var email =req.body.email;
    var admin_name =req.body.admin_name;
    var telephone =req.body.telephone;
    var used_yn_code =req.body.used_yn_code;

    var admin = {
        admin_member_id:articleIdx,
        dept_name,
        admin_id,
        admin_password,
        email,
        admin_name,
        telephone,
        used_yn_code,
        reg_date:Date.now()
    }


    res.redirect('/admin/list');
});




module.exports = router;