//사용자정보 데이터 관리 전용 RESTFul API 라우터 파일 
//기본 라우터 호출주소: http://localhost:3000/api/member/~

var express = require('express');
var router = express.Router();

var Member = require('../schemas/member');



//로그인 처리 API 라우팅 메소드
//http://localhost:3000/api/member/login
router.post('/login',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    //예외처리 구문
    try{
        //try블록안에 에러가 발생할 수 있는 각종 개발자 코드 구현..
        //Node 프로세스가 종료되지 않게 하기 위함과
        //오류내용을 내부적으로만 처리하고 오류 경우에 따른 상황을 다르게 처리하기위함입니다


        //step1: 사용자 입력 데이터 추출
        var email = req.body.email;
        var password = req.body.password;

        //step2: 입력한 이메일과 동일한 이메일을 DB에서 조회해온다
        const member = await Member.findOne({email});

        //step3: 조회해온 데이터가 맞는지 유효성 검사
        resultMsg = '';

        if(member == null){
            resultMsg = "동일한 이메일이 존재하지 않습니다.";

            apiResult.code = 400;
            apiResult.data = null;
            apiResult.result = resultMsg;
        }else{
            
            if(member.member_password == password){
                resultMsg = "로그인 되었습니다.";

                apiResult.code = 200;
                apiResult.data = member;
                apiResult.result = resultMsg;
            }else{
                resultMsg = "암호가 일치하지 않습니다."

                apiResult.code = 400;
                apiResult.data = null;
                apiResult.result = resultMsg;
            }
        }




    }catch(err){
        //console.log(err.message);
        //서버측 에러코드는 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표 메시지를 안내한다
        //서버측 에러코드는 추후 별도 로깅 시스템 구현을 통해 서버에 특정폴더내에 로그파일로 기록하거나
        //에러발생 알림 시스템을 통해 실시간 에러정보를 노티해준다
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "서버에러발생 관리자에게 문의해주세요.";
    }



    //JSON데이터로 반환한다
    res.json(apiResult);
});


//회원가입 처리 API 라우팅 메소드
//http://localhost:3000/api/member/entry
router.post('/entry',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    //예외처리 구문
    try{
        //try블록안에 에러가 발생할 수 있는 각종 개발자 코드 구현..
        //Node 프로세스가 종료되지 않게 하기 위함과
        //오류내용을 내부적으로만 처리하고 오류 경우에 따른 상황을 다르게 처리하기위함입니다


        //step1: 사용자 입력 데이터 값 추출
        var email = req.body.email;
        var member_password = req.body.password;
        var confirm_password = req.body.confirm_password;



        //step2: DB에 신규 데이터 영구저장
        var member = {
            email,
            member_password,
            name:"이름",
            profile_img_path:"드라이브",
            telephone:"01011111111",
            use_state_code:1,
            birth_date:"501231",
            reg_date: Date.now(),
            reg_member_id: 881
            };



        const savedmember = await Member.create(member);

        //프론트엔드로 실제 반환할 데이터 바인딩
        apiResult.code = 200;
        apiResult.data = savedmember;
        apiResult.result = "ok";


    }catch(err){
        console.log(err.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";
    }



    //JSON데이터로 반환한다
    res.json(apiResult);
});


//암호찾기 처리 API 라우팅 메소드
//http://localhost:3000/api/member/find
router.post('/find',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    //예외처리 구문
    try{
        //try블록안에 에러가 발생할 수 있는 각종 개발자 코드 구현..
        //Node 프로세스가 종료되지 않게 하기 위함과
        //오류내용을 내부적으로만 처리하고 오류 경우에 따른 상황을 다르게 처리하기위함입니다


        //step1: 사용자가 입력한 데이터 추출
        var email = req.body.email;


        //step2: DB에서 동일한 이메일을 조회해온다.
        const member = await Member.findOne({email});


        //step3: 조회한 데이터와 일치하는지 유효성 검사
        resultMsg = '';

        if(member == null){
            resultMsg = "동일한 이메일 존재하지 않습니다.";

            apiResult.code = 400;
            apiResult.data = null;
            apiResult.result = resultMsg;

        }else{
            resultMsg = "이메일 찾기 완료";

            apiResult.code = 200;
            apiResult.data = member;
            apiResult.result = resultMsg;
        }



    }catch(err){
        //console.log(err.message);
        //서버측 에러코드는 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표 메시지를 안내한다
        //서버측 에러코드는 추후 별도 로깅 시스템 구현을 통해 서버에 특정폴더내에 로그파일로 기록하거나
        //에러발생 알림 시스템을 통해 실시간 에러정보를 노티해준다
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "서버에러발생";
    }



    //JSON데이터로 반환한다
    res.json(apiResult);
});






//전체 사용자정보 목록 데이터 조회 반환 API 라우팅 메소드
//http://localhost:3000/api/member/all
router.get('/all',async(req,res)=>{

    //API라우팅 메소드 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    //예외처리 구문
    try{
        //try블록안에 에러가 발생할 수 있는 각종 개발자 코드 구현..
        //Node 프로세스가 종료되지 않게 하기 위함과
        //오류내용을 내부적으로만 처리하고 오류 경우에 따른 상황을 다르게 처리하기위함입니다


        //step1: DB에서 전체 사용자정보 목록 데이터를 조회한다.
        const members = await Member.find({});

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
        var confirm_password = req.body.confirm_password;


        //추출된 사용자 입력데이터를 단일 JSON데이터로 구성해서 DB테이블에 영구적으로 저장처리
        var member = {
        email,
        member_password,
        name:"이름",
        profile_img_path:"드라이브",
        telephone:"01011111111",
        use_state_code:1,
        birth_date:"501231",
        reg_date: Date.now(),
        reg_member_id: 881
        };


        //저장 후 DB테이블에 저장된 데이터를 반환한다
        const savedMember = await Member.create(member);

        //프론트엔드로 실제 반환할 데이터 바인딩
        //정상 등록된 데이터를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = savedMember;
        apiResult.result = "ok";


    }catch(err){

        console.log(err.message);
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
        var member_id = req.query.id;

        //DB 테이블에서 해당 사용자정보를 완전히 삭제한다

        //DB에서 삭제된 건수가 전달된다
        var deletedCnt = await Member.deleteOne({member_id});

        //정상 삭제된 정보를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = deletedCnt;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "failed";

    }



    res.json(apiResult);
});





//단일 사용자정보 수정처리 API라우팅 메소드
router.post('/modify/:id',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    try{

        //사용자가 수정한 데이터 추출 
        var member_id = req.params.id;

        var email = req.body.email;
        var member_password = req.body.member_password;
        var name = req.body.name;
        //var profile_img_path = req.body.profile_img_path;
        var telephone = req.body.telephone;
        //var use_state_code = req.body.use_state_code;
        var birth_date = req.body.birth_date;

        //추출된 데이터를 단일 JSON데이터로 구성해서 DB테이블에 수정처리를 반영한다
        // 수정처리에서는 required: true인 값을 다 입력받지 않아도 된다
        var member = {
            email,
            member_password,
            name,
            //profile_img_path,
            telephone,
            //use_state_code,
            birth_date,
            edit_date: Date.now(),
            edit_member_id: 991
            };

            //DB 수정처리 후 처리건수가 1이 반환됬다고 가정
            var affectedCnt = await Member.updateOne({member_id},member);

            //정상 수정된 정보를 apiResult객체 바인딩함
            apiResult.code = 200;
            apiResult.data = affectedCnt;
            apiResult.result = "ok";


    }catch(err){

        console.log(err.message);
        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "failed";

    }


    res.json(apiResult);
});


//사용자정보 데이터 조회 반환 API라우팅 메소드
//   localhost:3000/api/member/1
router.get('/:id',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };


    try{

        //URL주소에서 사용자고유번호를 추출한다
        var member_id = req.params.id;

        //DB에서 고유번호에 해당하는 단일 사용자정보 데이터를 조회해온다 
        var member = await Member.findOne({member_id});

        //정상 조회된 정보를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = member;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "ok";

    }



    res.json(apiResult);
});


module.exports = router;