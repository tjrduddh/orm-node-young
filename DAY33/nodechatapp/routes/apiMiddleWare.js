
//apiMiddleware 목적은
//각종 RESTFul API 라우터/라우팅메소드에소 데이터 요청하는측에서
//JWT사용자 로그인 인증토큰이 있는지 없는지를 체크해서 후행작업을 제어하는 미들웨어구현
//apiMiddleware.js 해당 호출 API를 해당 요청 사용자가 호출/사용가능한지에 대한 권한 체크 미들웨어


const jwt = require('jsonwebtoken');


exports.tokenAuthChecking = async (req,res,next) => {

    //step1: 발급된 토큰 정보가 존재하지 않을 경우
    if(req.headers.authorization == undefined){
        var apiResult = {
            code:"400",
            data:{},
            msg:"사용자 인증토큰이 제공되지 않았습니다."
        }

        return res.json(apiResult);
    }


    //제공 토큰의 유효성을 체크해서 유효하지 않으면 (만료토큰) 튕기고 정상적인 토큰이면 다음 콜백함수로 흘려보내기
    try{

        var token = req.headers.authorization.split('Bearer ')[1];

        //토큰의 유효성 검증 후 토큰내 JSON데이터를 추출합니다.
        var tokenJsonData = await jwt.verify(token,process.env.JWT_SECRET);

        //정상적인 사용자 데이터가 존재하는 경우 다음 프로세스로 이동처리(원래 호출하려던 라우팅메소드의 콜백함수를 실행)
        if(tokenJsonData != null){
            next();
        }

    }catch(err){

        var apiResult = {
            code:400,
            data:{},
            msg:"유효하지 않은 사용자 인증토큰입니다."
        }
        return res.json(apiResult);

    }
};