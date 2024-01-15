//사용자정보 데이터 관리 전용 RESTFul API 라우터 파일 
//기본 라우터 호출주소: http://localhost:3000/api/member/~

var express = require('express');
var router = express.Router();

//db객체는 반드시 var나 let으로 선언필요
var db = require('../models/index');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

//api라우팅 메소드 jwt토큰 체크 미들웨어 참조
const {tokenAuthChecking} = require('./apiMiddleWare');



//회원 로그인 처리 전용 RESTFul API
//http://localhost:3000/api/member/login
router.post('/login', async (req,res) => {

    var apiResult = {
        code:200,
        data:null,
        result:""
    }


    try{


    //스텝하나: 프론트엔드에서 제공되는 로그인 사용자 정보를 추출합니다.
    var email = req.body.email;
    var password = req.body.password;

    
    //스텝둘: 메일주소 존재여부를 체크합니다.
    var member = await db.Member.findOne({where:{email}});

    resultMsg = '';

    if(member == null){ 
        resultMsg = "동일한 메일주소가 존재하지 않습니다.";

        apiResult.code = 400;
        apiResult.data = null;
        apiResult.result = resultMsg;

    }else{

        //스텝셋: 동일 메일주소의 암호값을 체크합니다.
        const result = await bcrypt.compare(password,member.member_password);

        if(result){
            resultMsg = "로그인 성공";

            //스텝넷: 메일주소와 암호가 동일하면 사용자 정보중 주요정보를 JWT토큰으로 생성합니다.
            var tokenJsonData = {
                member_id:member.member_id,
                email:member.email,
                profile_img_path:member.profile_img_path,
                telephone:member.telephone,
            };

            //사용자 정보를 담고 있는 JWT사용자 인증토큰 생성완료
            const token = jwt.sign(tokenJsonData,process.env.JWT_SECRET,{expiresIn:'12h', issuer:'morm'});

            //스텝다섯: 생성된 JWT 사용자 인증토큰을 브라우저로 전달합니다.
            apiResult.code = 200;
            apiResult.data = token;
            apiResult.result = resultMsg;

        }else{

            resultMsg = "암호가 일치하지 않습니다.";

            apiResult.code = 400;
            apiResult.data = null;
            apiResult.result = resultMsg;

        }
    }


    }catch(err){
        console.log("서버에러발생: ",err);

        resultMsg = "서버에러발생 관리자에게 문의해주세요.";

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = resultMsg;

    }


    

    
    res.json(apiResult);
});

//회원가입 처리 전용 RESTFul API
//http://localhost:3000/api/member/entry
router.post('/entry', async (req,res) => {

    //프론트엔드에서 호출하는 모든 REST API 메소드는 반환형식을 아래와 같은 형식으로 반환합니다.
    var apiResult = {
        code:200,  //200(정상적인처리) 400(요청리소스가 없는 경우) 500(서버에러)
        data:null, //프론트엔드에 특정 값을 반환할때 해당 속성에 값을 넣어줍니다.
        result:""  //프론트엔드에게 처리결과 추가 메시지를 전달하고 싶을 때
    }



    try{

    //스텝하나: 프론트엔드에서 전달해주는 회원 json데이터의 속성값을 추출합니다.
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var telephone = req.body.telephone;
    var profileImg = req.body.profileImg;

    //스텝둘: 사용자 암호를 해시 단방향 암호화 문자열로 변환한다.
    var encryptedPassword = await bcrypt.hash(password,12);

    //스텝셋: DB에 member테이블에 저장할 json데이터 생성
    var member = {
        email:email,
        member_password:encryptedPassword,
        name:name,
        profile_img_path:profileImg,
        telephone:telephone,
        entry_type_code:0,
        use_state_code:1,
        birth_date:"",
        reg_date:Date.now(),
        reg_member_id:1
    }

    //스텝넷: DB에 member테이블에 데이터를 저장한다.
    //db.Member.create(member) 구분이 INSERT INTO SQL구문으로 변환되서 DB서버로 전달되어 데이터가 등록되고
    //등록이 완료된 실제 테이블 회원 데이터를 반환해준다.
    var registedMemberData = await db.Member.create(member);
    

    apiResult.code = 200;
    apiResult.data = registedMemberData;
    apiResult.result = "ok";

    }catch(err){

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.result = "failed";

    }

    //항상 API라우팅 메소드의 결괏값은 apiResult 객체를 반환하게 설계 필요..원할한 협업을 위해서..
    res.json(apiResult);

});


router.post('/find', async (req,res) => {

    var apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{

        var email = req.body.email;

        var member = await db.Member.findOne({where:{email}});

        resultMsg = "";
    
        if(member == null){
            resultMsg = "실패: 동일한 이메일이 없습니다."

            apiResult.code = 400;
            apiResult.data = null;
            apiResult.result = resultMsg;

        }else{
            resultMsg = "성공: 이메일 찾았다."

            apiResult.code = 200;
            apiResult.data = member;
            apiResult.result = resultMsg;

        }


    }catch(err){

        resultMsg = "서버에러발생 관리자에게 문의해주세요.";

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = resultMsg;

    };


    res.json(apiResult);
});


//로그인 완료한 사용자 개인 프로필 정보조회 API메소드
//반드시 로그인시 서버에서 발급해준 JWT토큰값이 전달되어야함.
//호출주소: localhost:3000/api/member/profile
router.get('/profile',tokenAuthChecking, async(req,res)=>{

    var apiResult = {
        code:"",
        data:{},
        result:""
    }

    try{

        //스텝하나: 현재 profile api를 호출하는 사용자 요청의
        // httpHeader영역에서 Authorization내 JWT토큰값 존재여부 확인 및 추출
        //'Bearer saffqegsgq'
        const token = req.headers.authorization.split('Bearer ')[1];

        
        // 이 부분은 미들웨어가 있으면 생략가능
        // console.log("req헤더에 저장된 jwt토큰값 출력하기: ",token);
        // //스텝둘: jwt토큰이 헤더를 통해 전달이 안된경우 결괏값 반환
        // if(token == undefined){
        //     apiResult.code = "400";
        //     apiResult.data = "notprovidetoken";
        //     apiResult.result = "인증토큰이 제공되지 않았습니다.";

        //     return res.json(apiResult);
        // }


        //스텝셋: 제공된 jwt토큰에서 사용자 메일주소를 추출한다.
        var tokenMember = jwt.verify(token,process.env.JWT_SECRET);
        console.log("jwt토큰내 저장된 사용자정보 확인하기: ",tokenMember);

        //스텝넷: 토큰에 저장된 메일주소로 DB에서 해당 사용자 최신정보를 조회합니다.
        var member = await db.Member.findOne({where:{email:tokenMember.email}});

        //중요개인정보는 프론트엔드에 제공시 초기화해서 전달한다.
        member.member_password = "";

        apiResult.code = "200";
        apiResult.data = member;
        apiResult.result = "ok";

    }catch(err){

        console.log("서버에러발생: ",err);

        resultMsg = "서버에러발생 관리자에게 문의해주세요.";

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = resultMsg;

    }


    res.json(apiResult);
});


//전체 사용자정보 목록 데이터 조회 반환 API 라우팅 메소드
//http://localhost:3000/api/member/all
router.get('/all',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:null,
        result:""
    };

    //예외처리 구문
    try{
        //try블록안에 에러가 발생할 수 있는 각종 개발자 코드 구현..
        //Node 프로세스가 종료되지 않게 하기 위함과
        //오류내용을 내부적으로만 처리하고 오류 경우에 따른 상황을 다르게 처리하기위함입니다


        //step1: DB에서 전체 사용자정보 목록 데이터를 조회한다.
        const members = await db.Member.findAll();


        //프론트엔드로 실제 반환할 데이터 바인딩
        apiResult.code = 200;
        apiResult.data = members;
        apiResult.result = "ok";


    }catch(err){
        //console.log(err.message);
        //서버측 에러코드는 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표 메시지를 안내한다
        //서버측 에러코드는 추후 별도 로깅 시스템 구현을 통해 서버에 특정폴더내에 로그파일로 기록하거나
        //에러발생 알림 시스템을 통해 실시간 에러정보를 노티해준다
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";
    }



    //JSON데이터로 반환한다
    res.json(apiResult);
});


//신규 사용자정보 등록처리 API라우팅 메소드
router.post('/create',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        //신규 사용자가 입력한 값을 추출한다/프론트엔드에서 전달해준 신규 JSON데이터 추출
        var email = req.body.email;
        var member_password = req.body.member_password;
        var name = req.body.name;



        //추출된 사용자 입력데이터를 단일 JSON데이터로 구성해서 DB테이블에 영구적으로 저장처리
        var member = {
            email,
            member_password,
            name
        };


        //저장 후 DB테이블에 저장된 데이터를 반환한다
        const savedMember = await db.Member.create(member);

        //프론트엔드로 실제 반환할 데이터 바인딩
        //정상 등록된 데이터를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = savedMember;
        apiResult.result = "ok";


    }catch(err){
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";
    }



    res.json(apiResult);
});


//단일 사용자정보 수정처리 API라우팅 메소드
//http://localhost:3000/api/member/modify
router.post('/modify',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    try{

        //사용자가 수정한 데이터 추출
        var member_id = req.body.member_id;

        var email = req.body.email;
        var member_password = req.body.member_password;
        var name = req.body.name;


        //추출된 데이터를 단일 JSON데이터로 구성해서 DB테이블에 수정처리를 반영한다
        var member = {
            email,
            member_password,
            name
            };

            //DB 수정처리 후 처리건수가 1이 반환됬다고 가정
            var updatedCount = await db.Member.update(member,{where:{member_id}});

            //정상 수정된 정보를 apiResult객체 바인딩함
            apiResult.code = 200;
            apiResult.data = updatedCount;
            apiResult.result = "ok";


    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";

    }


    res.json(apiResult);
});



//사용자정보 삭제처리 API 라우팅 메소드
router.post('/delete',async(req,res)=>{

    //API라우팅 반환 형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        //URL주소에서 사용자 고유번호를 추출한다
        var member_id = req.body.member_id;

        //DB 테이블에서 해당 사용자정보를 완전히 삭제한다

        //DB에서 삭제된 건수가 전달된다
        var deletedCnt = await db.Member.destroy({where:{member_id}});

        if(deletedCnt == 0){

            apiResult.code = 400;
            apiResult.data = null;
            apiResult.result = "사용자가 존재하지 않습니다.";

        }else{

        //정상 삭제된 정보를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = deletedCnt;
        apiResult.result = "ok";

        }



    }catch(err){

        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "failed";

    }



    res.json(apiResult);
});



//사용자정보 데이터 조회 반환 API라우팅 메소드
//   localhost:3000/api/member/1
router.get('/:mid',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        //URL주소에서 사용자고유번호를 추출한다
        var member_id = req.params.mid;

        //DB에서 고유번호에 해당하는 단일 사용자정보 데이터를 조회해온다 
        var member = await db.Member.findOne({where:{member_id}});

        if(member == null){

            apiResult.code = 400;
            apiResult.data = member;
            apiResult.result = "사용자가 존재하지 않습니다";

        }else{

            //정상 조회된 정보를 apiResult객체에 바인딩함
            apiResult.code = 200;
            apiResult.data = member;
            apiResult.result = "ok";

        }



    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "ok";

    }



    res.json(apiResult);
});





module.exports = router;