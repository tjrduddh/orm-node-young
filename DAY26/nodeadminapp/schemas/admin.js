
//mongoose 패키지를 참조한다
const mongoose = require('mongoose');

//숫자 자동채번 기능제공을 위한 mongoose-sequence 패키지 설치하고 참조하기
//npm i mongoose-sequence@5.3.1
//mongoose-sequence 기능을 이용하면 MongoDB 안에 counters콜렉션이 자동생성되고 자동채번번호를 관리해줍니다.
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Schema } = mongoose;

//Schema클래스를 생설할 때 생성자함수에 새로 만들 콜렉션의 스키마(데이터구조)를 정의합니다.
const adminSchema = new Schema({
    admin_member_id: {
        type: Number,
        required: true,
        unique: true  //KEY설정
    },
    company_code: {
        type: Number,
        required: true,
    },
    admin_id: {
        type: String,
        required: true,
    },
    admin_password: {
        type: String,
        required: true,
    },
    admin_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    dept_name: {
        type: String,
        required: true,
    },
    used_yn_code: {
        type: Number,
        required: true,
    },
    reg_user_id: {
        type: Number,
        required: true,
    },
    edit_user_id: {
        type: Number,
        required: false,
    },
    reg_date: {
        type: Date,
        default: Date.now,
    },
    edit_date: {
        type: Date,
        default: Date.now
    }
});


//자동채번 컬럼생성 및 콜렉션에 추가
adminSchema.plugin(AutoIncrement, { inc_field: "admin_member_id" }); //article_id는 1,2,3,4..


//mongoose.model('콜렉션이름',콜렉션 구조정의 클래스)호출해서 물리적인 콜렉션을(테이블)을 생성해줍니다.
module.exports = mongoose.model('Admin', adminSchema);