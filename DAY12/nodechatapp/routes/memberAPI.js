var express = require('express');
var router = express.Router();


router.get('/all',async(req,res)=>{

   var memberList = [
        {member_id:1,member_name:"회원1"},
        {member_id:2,member_name:"회원2"},
        {member_id:3,member_name:"회원3"}
   ];

   res.json(memberList);
});



//   localhost:3000/api/member?cid=1
router.get('/',async(req,res)=>{

    var memberId = req.query.cid;

    var member = {
        member_id:1,
        member_name:"회원1"
    };


 
    res.json(member);
 });



router.post('/create',async(req,res)=>{

    var memberId = req.body.member_id;
    var memberName = req.body.member_name;
    


    var member = {
        member_id:memberId,
        member_name:memberName,
    };


    res.json(member);
});


router.post('/modify',async(req,res)=>{

    var memberName = req.body.member_name;
    var memberDescription = req.body.member_desc;


    var member = {
        member_id:1,
        member_name:memberName,
        member_desc:memberDescription
    };


    res.json(member);
});


router.post('/delete',async(req,res)=>{

    var memberId = req.body.member_id;
    var memberName = req.body.member_name;
    


    var member = {
        member_id:memberId,
        member_name:memberName,
    };


    res.json(member);
});




//   localhost:3000/api/member/1
router.get('/:mid',async(req,res)=>{

    var memberId = req.params.mid;

    var member = {
        member_id:1,
        member_name:"회원1"
    };


 
    res.json(member);
 });


 module.exports = router;