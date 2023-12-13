var express = require('express');
var router = express.Router();


router.get('/all',async(req,res)=>{

    var channelList = [
        {channel_id:1,channel_name:"채널1"},
        {channel_id:2,channel_name:"채널2"},
        {channel_id:3,channel_name:"채널3"}
    ];

    res.json(channelList);
});



//   localhost:3000/api/channel?cid=1
router.get('/',async(req,res)=>{

    var channelId = req.query.cid;

    var channel = {
        channel_id:1,
        channel_name:"채널1"
    };



    res.json(channel);
});



router.post('/create',async(req,res)=>{

    var channelId = req.body.channel_id;
    var channelName = req.body.channel_name;
    


    var channel = {
        channel_id:channelId,
        channel_name:channelName,
    };


    res.json(channel);
});


router.post('/modify',async(req,res)=>{

    var channelName = req.body.channel_name;
    var channelDescription = req.body.channel_desc;


    var channel = {
        channel_id:1,
        channel_name:channelName,
        channel_desc:channelDescription
    };


    res.json(channel);
});


router.post('/delete',async(req,res)=>{

    var channelId = req.body.channel_id;
    var channelName = req.body.channel_name;
    


    var channel = {
        channel_id:channelId,
        channel_name:channelName,
    };


    res.json(channel);
});




//   localhost:3000/api/channel/1
router.get('/:id',async(req,res)=>{

    var channelId = req.params.id;

    var channel = {
        channel_id:channelId,
        channel_name:"채널1"
    };



    res.json(channel);
});






module.exports = router;