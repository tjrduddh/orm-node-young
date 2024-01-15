var express = require('express');
var router = express.Router();

var db = require('../models/index');

router.get('/all',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:null,
        result:""
    }


    //예외처리구문
    //try 블록안에 에러가 발생할 수 있는 각종 개발자 코드를 구현
    //오류내용을 내부적으로 처리하고 오류경우에 따라 상황을 다르게 처리하기 위함
    //오류코드를 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표메시지를 전달한다
    try{

        //DB에서 전체 채널목록 데이터를 조회해온다
        var channelList = await db.Channel.findAll();

        //프론트엔드로 실제 반환할 정상 조회된 apiResult객체를 바인딩함
        apiResult.code = 200;
        apiResult.data = channelList;
        apiResult.result = "okay";


    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";


    }




    //JSON데이터로 반환한다
    res.json(apiResult);
});




//신규 채널 등록처리 API라우팅 메소드
router.post('/create',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    }


    try{

        //신규 채널정보를 등록할 데이터 값을 추출한다
        var community_id = req.body.community_id;
        var category_code = req.body.category_code;
        var channel_name = req.body.channel_name;
        var user_limit = req.body.user_limit;
        var channel_state_code = req.body.channel_state_code;
        var reg_date = req.body.reg_date;
        var reg_member_id = req.body.reg_member_id;


        //추출된 채널정보를 단일 JSON데이터로 구성해서 DB테이블에 영구적으로 저장한다
        var channel =
            {
                community_id,
                category_code,
                channel_name,
                user_limit,
                channel_state_code,
                reg_date:Date.now(),
                reg_member_id
            }

        //저장 후 DB테이블에 저장된 정보를 반환한다
        const savedChannel = await db.Channel.create(channel);


        //프론트엔드에 실제 반환될 정상 등록된 데이터를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = savedChannel;
        apiResult.result = "ok";

    }catch(err){

        console.log(err.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";

    }

    res.json(apiResult);
});




//채널정보 수정처리 API라우팅 메소드
//http://localhost:3000/api/channel/modify
router.post('/modify',async(req,res)=>{

        //API라우팅 반환형식 정의
        var apiResult = {
            code:200,
            data:[],
            result:"ok"
        };

        
        try{

            var channel_id = req.body.channel_id;

            var community_id = req.body.community_id;
            var category_code = req.body.category_code;
            var channel_name = req.body.channel_name;
            var user_limit = req.body.user_limit;
            var channel_state_code = req.body.channel_state_code;
            var reg_date = req.body.reg_date;
            var reg_member_id = req.body.reg_member_id;


            var channel =
            {
                community_id,
                category_code,
                channel_name,
                user_limit,
                channel_state_code,
                reg_date:Date.now(),
                reg_member_id
            }

            //DB 수정처리 후 처리건수가 1이 반환됬다고 가정함
            var modifyCnt = await db.Channel.update(channel,{where:{channel_id}});

            apiResult.code = 200;
            apiResult.data = modifyCnt;
            apiResult.result = "ok";

        }catch(err){

            console.log(err.message);

            apiResult.code = 500;
            apiResult.data = 0;
            apiResult.result = "failed";

        }



    res.json(apiResult);
});




router.post('/delete',async(req,res)=>{



        var apiResult = {
            code:200,
            data:[],
            result:"ok"
        };
    

        try{

            var channel_id = req.body.channel_id;

            var deleteCnt = await db.Channel.destroy({where:{channel_id}});

            apiResult.code = 200;
            apiResult.data = deleteCnt;
            apiResult.result = "ok";

        }catch(err){

            apiResult.code = 500;
            apiResult.data = 0;
            apiResult.result = "failed";

        }

    res.json(apiResult);
});



//단일 채널정보 조회 반환 API 라우팅 메소드
//localhost:3000/api/channel/1
router.get('/:id',async(req,res)=>{

    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    try{

        var channel_id = req.params.id;

        var channel = await db.Channel.findOne({where:{channel_id}});

        apiResult.code = 200;
        apiResult.data = channel;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "ok";

    }



    res.json(apiResult);
});






module.exports = router;