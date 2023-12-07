/*
-기능 : 각종 회원정보 요청과 응답 처리 라우팅 파일
-약관페이지 요청 응답, 회원가입 웹페이지 요청과 응답처리
-기본 라우팅 주소 : http://localhost:3000/member/~
-사용자가 링크클릭이나 URL을 직접 입력한 주소가 http://localhost:3000/member/~이면
노드앱의 app.js에 참조된 라우터 파일 중 해당 /member/~기본주소를 관리하는 해당 라우터 파일을 먼저 찾고
그 다음에 사용자가 요청한 /member/entry entry라우팅 메소드 주소로 바인딩 된 라우팅메소드를 찾아
요청과 응답을 해당 라우팅 메소드에서 처리해준다.
*/

//member.js 사용자 요청과 응답을 처리해주는 라우터 파일 생성
//localhost:3000/member 라는 기본주소체계를 갖는다

//require()예약어로 express 패키지 모듈을 가져온다(package.json 참조)
var express = require('express');

//express객체의 Router()메소드를 호출해서  router객체를 생성한다
var router = express.Router();

//중요: 사용자가 요청하는 방식(get,post...)과 주소(/join)가 동일한 라우팅 메소드 주소를 찾는다
/*
-기능: 사용자 가입 약관 웹페이지에 대한 요청과 응답처리 라우팅 메소드
-요청방식: GET
-요청주소: http://localhost:3000/member/join
-응답결과: 회원약관 웹페이지 전달(join.ejs뷰)
*/
router.get('/join',function(req,res){
    res.render('member/join.ejs'); //파일 경로를 지정 (.ejs 생략가능)
    // res.redirect('/member/join'); //http://localhost:3000/member/join 원래는 이 주소지만 동일한 주소는 생략

    // res.render('뷰파일의 물리적 전체경로가 들어간다');
    // res.redirect('중요:링크URL주소가 들어간다!');
});

/*
-기능: 신규회원 직접 가입 웹페이지(가입폼) 요청과 응답 처리 라우팅 메소드
-요청방식: GET ==> router.get()
-요청주소: http://localhost:3000/member/entry
-응답결과: 회원가입 웹페이지(html,css,javascript=views/member/entry.ejs)
*/
//슬래시 /를 잘 넣어준다
//get으로 요청했기 때문에 웹페이지에 회원가입버튼을 눌러(링크를 통해 요청) 회원가입뷰를 보여주기위해 요청한다
router.get('/entry',function(req,res){
    res.render('member/entry');
});


/*
-기능: 사용자 입력한 회원정보 DB처리하고 로그인페이지로 이동시키는 요청과 응답처리 라우팅메소드
-요청방식: POST
-요청주소: http://localhost:3000/member/entry
*/
router.post('/entry',function(req,res){

    //step1: 사용자가 입력한 회원가입정보를 추출한다
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var telephone = req.body.telephone;

    //step2: DB에 member테이블에 동일한 사용자 메일주소가 있는지 체크한다

    //step3: 메일주소가 중복되지 않으면 신규회원으로 해당 사용자 정보를 member테이블에 저장한다
    //member테이블에 저장할 실제 사용자정보
    var member ={
        email,
        password,
        name,
        telephone,
        entryDate:Date.now()
    }

    //step4:데이터가 정상적으로 등록된 경우 사용자 웹페이지를 로그인 페이지로 이동시켜준다
    res.redirect('/auth/login');
});


//중요: 라우터파일은 반드시 해당 라우터 객체를 exports를 통해 외부로 노출해줘야
//노드 어플리케이션에서 인식한다
module.exports = router;