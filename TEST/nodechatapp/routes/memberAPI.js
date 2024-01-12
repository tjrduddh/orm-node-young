//사용자정보 데이터 관리 전용 RESTFul API 라우터 파일 
//기본 라우터 호출주소: http://localhost:3000/api/member/~

var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
var AES = require('mysql-aes');


var db = require('../models/index');

//사용자 토큰제공여부 체크 미들웨어 참조하기
var {tokenAuthChecking} = require('./apiMiddleware.js');



//회원 로그인 처리 전용 RESTFul API
//http://localhost:3000/api/member/login
router.post('/login', async (req,res) => {

    var apiResult = {
        code:200,
        data:null,
        result:""
    }


    try{


    //사용자 입력 값
    var email = req.body.email;
    var password = req.body.password;

    

    var member = await db.Member.findOne({where:{email}});

    resultMsg = '';

    if(member == null){ 
        resultMsg = "동일한 메일주소가 존재하지 않습니다.";

        apiResult.code = 400;
        apiResult.data = null;
        apiResult.result = resultMsg;

    }else{

    var compareResult = await bcrypt.compare(password, member.member_password);

    if(compareResult){
        resultMsg = "로그인 성공";

        member.member_password = "";


        //step3: 인증된 사용자의 기본정보 JWT토큰 생성 발급
        //3-1: JWT토큰에 담을 사용자 정보 생성
        //JWT인증 구별가능한 사용자정보 토큰 값 구조 정의 및 데이터 세팅
        var memberTokenData = {
            member_id:member.member_id,
            email:member.email,
            name:member.name,
            profile_img_path:member.profile_img_path,
            telephone:member.telephone,
            etc:"기타정보"
        }

        var token = await jwt.sign(memberTokenData,process.env.JWT_SECRET,{expiresIn:'24h', issuer:'yso'});



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

    var apiResult = {
        code:200,
        data:null,
        result:""
    }

    try{

    //사용자가 입력한 정보 추출
    var email = req.body.email;
    var member_password = req.body.password;
    var name = req.body.name;
    

    //DB 신규회원등록 처리
    var member = {
        email,
        member_password,
        name
    }  
    
    const savedMember = await db.Member.create(member);

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


/*
- 로그인한 현재 사용자의 회원 기본정보 조회 API
- http://localhost:3000/api/member/profile
- 로그인시 발급한 JWT토큰은 HTTP Header영역에 포함되어 전달된다.
*/
router.get('/profile',tokenAuthChecking, async (req,res,next) => {

    var apiResult = {
      code:400,
      data:null,
      msg:""
    }
  
  
    try{
  
      //step1: 웹브라우저 헤더에서 사용자 JWT Bearer 인증토큰 값을 추출한다.
      //req.headers.authorization = "Bearer FQGQDQF55FQFQF"
      var token = req.headers.authorization.split('Bearer ')[1];
  
      var tokenJsonData = await jwt.verify(token,process.env.JWT_SECRET);
      console.log("API 호출 사용자정보:",tokenJsonData);
  
      //웹브라우저에서 전달된 JWT토큰문자열에서 필요한 로그인 사용자 정보를 추출합니다.
      var loginMemberId = tokenJsonData.member_id;
      var loginMemberEmail = tokenJsonData.email;
  
      var dbMember = await db.Member.findOne({
        where:{member_id:loginMemberId},
        attributes:['email','name','profile_img_path','telephone','birth_date']
      });
  
      //dbMember.telephone = AES.decrypt(dbMember.telephone, process.env.MYSQL_AES_KEY);
  
      apiResult.code= 200;
      apiResult.data= dbMember;
      apiResult.msg= "ok";
  
    }catch(err){
  
      apiResult.code= 500;
      apiResult.data= null;
      apiResult.msg= err.message;
  
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