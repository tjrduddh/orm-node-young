//게시글 정보관리 각종 웹페이지 요청과 응답처리 라우터 전용파일
//http://localhost:3000/article/~


var express = require('express');
var router = express.Router();

var db = require('../models/index');
var Op = db.Sequelize.Op;



//게시글 목록 조회 웹페이지 요청 및 응답 라우팅 메소드
router.get('/list', async(req, res, next)=> {

    var searchOption = {
        board_type_code:"0",
        title:"",
        is_display_code:"9"
    }

    //step1: DB에서 모든 게시글 데이터 목록을 조회해옵니다
    //db.Article.findAll() 메소드는 article테이블에 모든 데이터를 조회하는
    //SELECT article_id,,,, FROM WHERE is_display_code AND view_count != 0; SQL쿼리로 변환되어 DB서버에 전달되어 실행되고 그 결과물을 반환한다
    var articles = await db.Article.findAll(
        {
            attributes: ['article_id','board_type_code','title','article_type_code','view_count','is_display_code','reg_date','reg_member_id'],
            // where: {
            //     is_display_code:1,
            //     view_count: {[Op.not]:0}
            // },
            order: [['article_id','DESC']]  //DESC 오름차순: 3,2,1 / ASC 내림차순: 1,2,3
        }
    );



    //step2: 게시글 전체목록을 list.ejs뷰에 전달한다
    res.render('article/list',{articles,searchOption});
});

//게시글 목록에서 조회옵션 데이터를 전달받아 조회옵션기반 게시글 목록 조회후
//게시글 목록 페이지에 대한 요청과 응답처리
router.post('/list', async(req, res, next)=> {
    
    //step1: 사용자가 선택/입력한 조회옵션 데이터를 추출한다
    var board_type_code = req.body.board_type_code;
    var title = req.body.title;
    var is_display_code = req.body.is_display_code;

    var searchOption = {
        board_type_code,
        title,
        is_display_code
    }


    //step2: 사용자가 입력/선택한 조회옵션 데이터를 기반으로 DB에서 게시글 목록을 재조회온다
    //SELECT * FROM article WHERE board_type_code = 1 SQL구문으로 변환되어 DB서버에 전달 실행
    var articles = await db.Article.findAll({where:{board_type_code:searchOption.board_type_code}});

    
    //step3: 게시글 목록 페이지 list.ejs에 데이터 목록을 전달한다.
    //라우터 post에서 꼭 redirect를 쓰는게 아니다. 설계자가 어떻게 보여줄지에 대한 시나리오에 따라 다르다
    res.render('article/list',{articles,searchOption});
});

//신규 게시글 등록 웹페이지 요청 및 응답 라우팅 메소드
//http://localhost:3000/article/create
router.get('/create', async(req, res, next)=> {
    
    res.render('article/create');
});


//신규 게시글 사용자 등록정보 처리 요청 및 응답 라우팅 메소드
router.post('/create', async(req, res, next)=> {

    //step1: 사용자가 입력한 게시글 등록 데이터 추출
    var board_type_code =req.body.board_type_code;
    var title =req.body.title;
    var contents =req.body.contents;
    var article_type_code =req.body.article_type_code;
    var is_display_code =req.body.is_display_code;
    var register =req.body.register;

    //step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
    //DB article테이블에 영구적으로 저장처리한다.
    //저장처리 후 article테이블에 저장된 데이터 반환됩니다.

    //등록할 게시글 데이터
    //**중요: 테이블에 저장 / 수정할 데이터 소스는 반드시 데이터 모델의 속성명을 이용해야한다.
    //**조심하세요: article 모델 컬럼에 값이 반드시 들어와야하는 값(IS NOT NULL)은 값을 전달해야한다.
    var article = {
        board_type_code,
        title,
        contents,
        view_count:0,
        ip_address:"111.111.222.222",
        article_type_code,
        is_display_code,
        reg_member_id:1,
        reg_date:Date.now()
    };


    //게시글 정보를 article테이블에 저장하고 저장된 값을 다시 반환받는다
    await db.Article.create(article);
    //var registedArticle = await db.Article.create(article);

    //step3: 등록처리 후 게시글 목록  웹페이지로 이동
    res.redirect('/article/list');
});


//기존 게시글 삭제처리 요청 및 응답 라우팅 메소드
//http://localhost:3000/article/delete?aid=3
router.get('/delete', async(req, res, next)=> {

    //step1: 삭제하려는 게시글 고유번호를 추출한다
    var articleIdx = req.query.aid;

    //step2: 게시글번호기반으로 실제 DB article테이블에서 데이터를 삭제처리한다.
    var deleteCnt = await db.Article.destroy({where:{article_id:articleIdx}});


    //step3: 게시글 목록 페이지로 이동시킨다.
    res.redirect('/article/list');
});



  //기존 게시글 정보 확인 및 수정 웹페이지 요청과 응답 라우팅 메소드
  //http://localhost:3000/article/modify/1
  //GET
router.get('/modify/:aid', async(req, res, next)=> {

    //step1: 선택한 게시글 고유번호를 파라메터 방식으로 URL을 통해 전달받음
    var articleIdx = req.params.aid;


    //step2: 해당 게시글 번호에 해당하는 특정 단일게시글 정보를 DB article테이블에서
    //조회해온다.
    var article = await db.Article.findOne({where:{article_id:articleIdx}});



    //step3: 단일 게시글 정보로 뷰에 전달한다.
    res.render('article/modify',{article});
});


  //기존 게시글 사용자 수정정보 처리 요청과 응답 라우팅 메소드
  //http://localhost:3000/article/modify/1
router.post('/modify/:aid', async(req, res, next)=> {

        //게시글 고유번호 URL파라메터에서 추출하기
        var articleIdx = req.params.aid;


        //step1: 사용자가 입력한 게시글 등록 데이터 추출
        var board_type_code =req.body.board_type_code;
        var title =req.body.title;
        var contents =req.body.contents;
        var article_type_code =req.body.article_type_code;
        var is_display_code =req.body.is_display_code;
        var register =req.body.register;
    
        //step2: 추출된 사용자 입력데이터를 단일 게시글 json데이터로 구성해서
        //DB article테이블에 영구적으로 수정처리한다.
        //수정처리하면 처리건수 값이 반환됩니다.
    
        //수정할 게시글 데이터
        var article = {
            board_type_code,
            title,
            contents,
            article_type_code,
            is_display_code,
            ip_address:"111.111.222.222",
            edit_member_id:1,
            edit_date:Date.now()
        };
    

        //DB article테이블의 컬럼내용을 수정처리하고 수정건수 반환받기
        //db.Article.update(수정할 데이터,조건)는
        //UPDATE article SET board_type_code = 1, title = '', contents = ''.....WHERE article_id = 1; SQL이 생성되어
        //DB서버로 전달되어 수정되고 수정된 건수가 배열로 전달된다.
        var updatedCount = await db.Article.update(article,{where:{article_id:articleIdx}});
    

        //step3: 등록처리 후 게시글 목록  웹페이지로 이동
        res.redirect('/article/list');

});





module.exports = router;