//기본주소 http://localhost:3001/admin
//관리자 사이트 관리자 계정 정보관리 라우팅 기능 제공

var express = require('express');
var router = express.Router();

var moment = require('moment');

//MongoDB ODB 모델 참조하기
const Admin = require('../schemas/admin');



//관리자 정보 목록 조회 웹페이지 요청 및 응답 라우팅 메소드
router.get('/list',async(req,res)=>{


    var searchOption = {
        dept_name:"0",
        admin_name:"",
        telephone:""
    }

    const admins = await Admin.find({});

    res.render('admin/list',{admins,searchOption,moment});
});


router.post('/list',async(req,res)=>{

        // //step1: 사용자가 선택/입력한 조회옵션 데이터를 추출한다
        var dept_name = req.body.dept_name;
        var admin_name = req.body.admin_name;
        var telephone = req.body.telephone;
    
        var searchOption = {
            dept_name,
            admin_name,
            telephone
        }


        let Search = {};


        if (dept_name !== '0') {
            Search.dept_name = searchOption.dept_name;
        }

         // $regex : 부분 검색을 할 수 있게되어 많은 패턴들을 받아올 수 있다.
         // $options : 대소문자 구별없이 검색이 가능하다
        if (admin_name) { 
            Search.admin_name = {$regex: admin_name, $options: 'i'};
        }

        // 변수명 자체가 조건일 때 ''빈값이 들어오면 조건 결괏값이 false가 되어 if문을 나간다.
        if (telephone) {
            Search.telephone = {$regex: telephone, $options: 'i'};
        }

        const admins = await Admin.find(Search)

        


    res.render('admin/list',{admins,searchOption,moment});
});


router.get('/create',async(req,res)=>{
    res.render('admin/create');
});


router.post('/create',async(req,res) => {

        //step1: 사용자가 입력한 게시글 등록 데이터 추출
        // var dept_name =req.body.dept_name;
        // var admin_id =req.body.admin_id;
        // var admin_password =req.body.admin_password;
        // var email =req.body.email;
        // var admin_name =req.body.admin_name;
        // var telephone =req.body.telephone;
        // var used_yn_code =req.body.used_yn_code;
        // var reg_date =req.body.reg_date;

        // var admin = {
        //     dept_name,
        //     admin_id,
        //     admin_password,
        //     email,
        //     admin_name,
        //     telephone,
        //     used_yn_code,
        //     reg_date,
        //     company_code:1,
        //     reg_user_id:1
        // }

        const createdAdmin = await Admin.create({
            dept_name :req.body.dept_name,
            admin_id :req.body.admin_id,
            admin_password :req.body.admin_password,
            email :req.body.email,
            admin_name :req.body.admin_name,
            telephone :req.body.telephone,
            used_yn_code :req.body.used_yn_code,
            reg_date :req.body.reg_date,
            company_code :1,
            reg_user_id :1
        });


    res.redirect('/admin/list');
});



router.get('/delete', async (req,res) => {

    var adminIdx = req.query.mid;

    var deleteCnt = await Admin.deleteOne({admin_member_id:adminIdx});

    res.redirect('/admin/list');
});






router.get('/modify/:mid', async (req,res) => {

    var adminIdx = req.params.mid;


    var admin = await Admin.findOne({admin_member_id:adminIdx});

    res.render('admin/modify',{admin,moment});
});



router.post('/modify/:mid', async (req,res) => {

    var adminIdx = req.params.mid;


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

    var updatedCnt = await Admin.updateOne({admin_member_id:adminIdx},admin);

    res.redirect('/admin/list');
});




module.exports = router;