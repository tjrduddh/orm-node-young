var express = require('express');
var router = express.Router();


router.get('/all',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"okay"
    }


    //예외처리구문
    //try 블록안에 에러가 발생할 수 있는 각종 개발자 코드를 구현
    //오류내용을 내부적으로 처리하고 오류경우에 따라 상황을 다르게 처리하기 위함
    //오류코드를 프론트엔드나 사용자에게 직접 정보를 제공하지 않고 대표메시지를 전달한다
    try{

        //DB에서 전체 채널목록 데이터를 조회해온다
        var channelList = [
            {
                channel_id:1,
                category_code:1,
                channel_name:'넷플릭스',
                user_limit:1000,
                channel_img_path:'넷플로고',
                channel_state_code:1,
                reg_date:Date.now('yyyy-mm-dd'),
                reg_member_id:1,
                edit_date:Date.now('mm-dd'),
                edit_member_id:1
            },
            {
                channel_id:2,
                category_code:2,
                channel_name:'유튜브',
                user_limit:2000,
                channel_img_path:'유튜브로고',
                channel_state_code:2,
                reg_date:Date.now('yyyy-mm-dd'),
                reg_member_id:2,
                edit_date:Date.now('mm-dd'),
                edit_member_id:2
            },
            {
                channel_id:3,
                category_code:3,
                channel_name:'왓챠',
                user_limit:3000,
                channel_img_path:'왓챠로고',
                channel_state_code:3,
                reg_date:Date.now('yyyy-mm-dd'),
                reg_member_id:3,
                edit_date:Date.now('mm-dd'),
                edit_member_id:3
            }
        ];

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



// //   localhost:3000/api/channel?cid=1
// router.get('/',async(req,res)=>{

//     var channelId = req.query.cid;

//     var channel = {
//         channel_id:1,
//         channel_name:"채널1"
//     };



//     res.json(channel);
// });


//신규 채널 등록처리 API라우팅 메소드
router.post('/create',async(req,res)=>{

    //API라우팅 반환형식 정의
    var apiResult = {
        code:200,
        data:[],
        result:"okay"
    }


    try{

        //신규 채널정보를 등록할 데이터 값을 추출한다
        var category_code = req.body.category_code;
        var channel_name = req.body.channel_name;
        var channel_img_path = req.body.channel_img_path;
        var reg_date = req.body.reg_date;


        //추출된 채널정보를 단일 JSON데이터로 구성해서 DB테이블에 영구적으로 저장한다
        var channel =
            {
                channel_id:1,
                category_code,
                channel_name,
                user_limit:1000,
                channel_img_path,
                channel_state_code:1,
                reg_date,
                reg_member_id:1,
                edit_date:Date.now('mm-dd'),
                edit_member_id:1
            }

        //저장 후 DB테이블에 저장된 정보를 반환한다
        const savedChannel = {
            channel_id:3,
            category_code:3,
            channel_name:'왓챠',
            user_limit:3000,
            channel_img_path:'왓챠로고',
            channel_state_code:3,
            reg_date:Date.now('yyyy-mm-dd'),
            reg_member_id:3,
            edit_date:Date.now('mm-dd'),
            edit_member_id:3
        }


        //프론트엔드에 실제 반환될 정상 등록된 데이터를 apiResult객체에 바인딩함
        apiResult.code = 200;
        apiResult.data = savedChannel;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "failed";

    }

    res.json(apiResult);
});

//채널정보 수정처리 API라우팅 메소드
router.post('/modify',async(req,res)=>{

        //API라우팅 반환형식 정의
        var apiResult = {
            code:200,
            data:[],
            result:"ok"
        };

        
        try{

            var channel_id = req.body.channel_id;

            var category_code = req.body.category_code;
            var channel_name = req.body.channel_name;
            var channel_img_path = req.body.channel_img_path;
            var reg_date = req.body.reg_date;


            var channel =
            {
                channel_id,
                category_code,
                channel_name,
                user_limit:1000,
                channel_img_path,
                channel_state_code:1,
                reg_date,
                reg_member_id:1,
                edit_date:Date.now('mm-dd'),
                edit_member_id:1
            }

            //DB 수정처리 후 처리건수가 1이 반환됬다고 가정함
            var modifyCnt = 1;

            apiResult.code = 200;
            apiResult.data = modifyCnt;
            apiResult.result = "ok";

        }catch(err){

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

            var deletedCnt = 1;

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




//   localhost:3000/api/channel/1
router.get('/:id',async(req,res)=>{

    var apiResult = {
        code:200,
        data:[],
        result:"ok"
    };

    try{

        var channel_id = req.params.channel_id;

        var channel = {
            channel_id:3,
            category_code:3,
            channel_name:'왓챠',
            user_limit:3000,
            channel_img_path:'왓챠로고',
            channel_state_code:3,
            reg_date:Date.now('yyyy-mm-dd'),
            reg_member_id:3,
            edit_date:Date.now('mm-dd'),
            edit_member_id:3
        };

        apiResult.code = 200;
        apiResult.data = channel;
        apiResult.result = "ok";

    }catch(err){

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "ok";

    }



    res.json(channel);
});






module.exports = router;