var bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
var db = require('../models/index');


module.exports = passport => {
    passport.use(
        new LocalStrategy(
          {
            usernameField: 'id', //로그인 페이지의 사용자아이디 UI INPUT 요소 name값
            passwordField: 'password',//로그인 페이지의 사용자 암호 INPUT 요소 name값
          },
          //위에 필드값을 설정해주면 사용자가 로그인시 아이디/암호 값이 아래 매개변수로 넘어온다(adminId, adminPWD)
          async (adminId, adminPWD, done) => {
    
            //사용자가 입력한 아이디/암호를 기반으로 로그인 기능을 구현합니다.
            try {
    
              //스텝1: 사용자가 입력한 관리자 아이디값을 기준으로 관리자 계정 아이디 조회  
              const admin = await db.Admin.findOne({ where: { admin_id: adminId } });
              
              if (admin) {

                //스텝2-1: 동일한 관리자 계정아이디가 존재하는 경우 암호를 체크한다
                const result = await bcrypt.compare(adminPWD, admin.admin_password);

                if (result) {
    
                  //스텝3-1: 관리자 계정암호가 동일한 경우 서버세션 객체정보의 구조를 정의하고
                  //로그인한 사용자의 정보로 세션정보를 생성한다
                  var sessionAdmin = {
                    admin_member_id: admin.admin_member_id,
                    admin_id: admin.admin_id,
                    admin_name: admin.admin_name,
                    email: admin.email,
                    telephone: admin.telephone,
                  };
    
                  //done(null,세션으로 저장할 세션데이터);
                  //null - 에러가 날 경우 넘어가는 콜백함수의 첫번째 파라미터인 authError
                  done(null, sessionAdmin);

                } else {

                  //스텝3-2: 사용자 암호가 일치하지 않은 경우 / 2번째 파라미터는 전달할 값이 없어서 false / 3번째 파라미터는 왜 그런지 메시지 전달
                  done(null, false, { message: '비밀번호가 일치하지 않습니다.' });

                }
              } else {

                //스텝2-2: 사용자 아이디가 존재하지 않은경우
                done(null, false, { message: '아이디가 존재하지 않습니다.' });

              }
            } catch (error) {

              //에러가 날 경우 catch를 통해 전달하며 null => error 로 바뀜
              console.error(error);
              done(error);

            }
    
          },
        ),
      );
    };