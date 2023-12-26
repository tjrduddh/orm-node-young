//채팅 웹페이지 정보관리 라우팅 기능 제공
//기본주소 http://localhost:3000/chat
var express = require("express");
var router = express.Router();

//채팅 메인페이지 요청 및 응답
router.get('/', async (req,res) => {

      res.render('chat/index',{layout:"chatLayout"});
});





module.exports = router;