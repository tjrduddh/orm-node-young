var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require("cors");

//환경설정파일 호출하기 : 전역정보로 설정됩니다.
//호출위치는 반드시 app.js내 최상위에서 호출할 것..
require('dotenv').config();

//express기반 서버세션 관리 패키지 참조하기 
var session = require('express-session');

var sequelize = require('./models/index').sequelize;

//express-ejs-layouts 패키지 참조하기
var expressLayouts = require('express-ejs-layouts');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var articleRouter = require('./routes/article');
var articleAPIRouter = require('./routes/articleAPI');

var app = express();

//mysql과 자동연결처리 및 모델기반 물리 테이블 생성처리제공
sequelize.sync();


// 특정 도메인주소만 허가,
// app.use(
//   cors({
//     methods: ["GET", "POST", "DELETE", "OPTIONS"],
//     origin: ["http://localhost:3000", "https://beginmate.com"],
//   })
// );

// 모든 호출 허락
app.use(cors());


//express-session기반 서버세션 설정 구성하기 
app.use(
  session({
    resave: false,//매번 세션 강제 저장 - 로그인시마다 세션구조/데이터 변경없어도 다시 저장여부 체크
    saveUninitialized: true, //빈 세션도 저장할지 여부. 기본 false ?
    secret: process.env.COOKIE_SECRET, //암호화할떄 사용하는 salt값
    cookie: {
      httpOnly: true, //javascript로 쿠키에 접근하지 못하게 하는 옵션
      secure: false, //https 환경에서만 session 정보를 주고받도록 처리
      maxAge:1000 * 60 * 20 //쿠키의 유효기간(= 세션의 유효기간) 설정: 20분동안 서버세션을 유지하겠다.(1000은 1초)
    },
  }),
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//레이아웃 설정
app.set('layout', 'layout.ejs'); //해당 노드앱의 모든 (컨텐츠)뷰파일의 기본 레이아웃ejs파일 설정하기
app.set("layout extractScripts", true); //콘텐츠페이지내 script태그를 레이아웃에 통합할지 여부
app.set("layout extractStyles", true); //콘텐츠페이지내 style태그를 레이아웃에 통합할지 여부
app.set("layout extractMetas", true);  //콘텐츠페이지내 meta태그를 레이아웃에 통합할지 여부
app.use(expressLayouts);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.use('/article', articleRouter);
app.use('/api/article', articleAPIRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
