//채팅 웹페이지 정보관리 라우팅 기능 제공
//기본주소 http://localhost:3000/chat
var express = require("express");
var router = express.Router();


router.get('/', async (req,res) => {

    var chatlists = [
        {
          channelNum: 1,
          userNum: 1,
          userNickname: '일돌이',
          userLog: 1,
          connectStatus: 1,
          enterDate: Date.now(),
          outDate: Date.now(),
          connectionId: 'one',
          msgStatus: 1,
          ipAddress: '111.111.111.111',
          editDate: Date.now(),
          editId: 'one2'
        },
        {
            channelNum: 2,
            userNum: 2,
            userNickname: '이돌이',
            userLog: 2,
            connectStatus: 2,
            enterDate: Date.now(),
            outDate: Date.now(),
            connectionId: 'two',
            msgStatus: 2,
            ipAddress: '222.111.111.111',
            editDate: Date.now(),
            editId: 'two2'
          },
          {
            channelNum: 3,
            userNum: 3,
            userNickname: '삼돌이',
            userLog: 3,
            connectStatus: 3,
            enterDate: Date.now(),
            outDate: Date.now(),
            connectionId: 'three',
            msgStatus: 3,
            ipAddress: '123.111.111.111',
            editDate: Date.now(),
            editId: 'three2'
          }
          
      
      ];
    
      res.render('chat/index', { chatlists });
    });


// router.get('/', function(req, res, next) {

//   var channelList = [
//     {channel_id:1,channel_name:"채널1"},
//     {channel_id:2,channel_name:"채널2"},
//     {channel_id:3,channel_name:"채널3"}
//   ];

//   res.render('chat/index', { channelList });
// });



module.exports = router;