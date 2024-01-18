
//socket.io 패키지를 참조한다
const SocketIO = require('socket.io');

//socket.io-redis참조
var redis = require("socket.io-redis");


module.exports = (server) => {

    //SocketIO('서버소켓이 실행될 백엔드서버 객체',
    //웹브라우저 클라이언트에 제공될 클라이언트 스크립트 socket라이브러리 경로)
    //클라이언트 스크립트 Socket라이브러리: http://localhost:3000/socket.io/socket.io.js(client측 socket.io 통신모듈)
    // const io = SocketIO(server,{path:"/socket.io"})

    //CORS 이슈처리 적용한 io객체 생성
    const io = SocketIO(server, {
        path: "/socket.io",
        cors: {
        origin: "*",
        methods: ["GET", "POST"],
        },
        });

    //Redis Backplain 연결설정
    //env파일에 넣어서 관리하세요..
    io.adapter(
        redis({
            host: "127.0.0.1",
            port: "6379",
            password: "test12345"
        })
    );

    //io.on("이벤트명",이벤트처리 콜백함수());
    //io서버소켓이 클라이언트와 연결이 완료되면 메시지 수발신 기능을 제공합니다.
    //소켓은 반드시 클라이언트와 연결이 된 상태에서만 메시지를 주고받을 수 있다.
    //그래서 io 서버소켓이 connection이벤트가 발생한 스코프(범위)안에서 각종 메시지 수발신 처리기능을 구현합니다.
    //클라이언트와 서버소켓만 연결이 완료되면 클라이언트/서버연결 정보를 가진 socket이란 객체가 전달됨.
    //io는 서버소켓 자체이고(상위개념),socket은 클라이언트와 연결된 연결정보객체입니다.
    io.on("connection",async(socket)=>{

        //서버소켓과 연결된 각각의 클라이언트간 수발신 기능구현
        //socket.on("서버측 메시지 수신기 이벤트명",이벤트처리기 콜백함수(데이터));
        socket.on("broadcast",async(msg)=>{
            
            //io.emit("클라이언트 이벤트 수신기명",data)은 현재 서버소켓인 io에 연결된 모든 사용자에게
            //지정한 클라이언트 이벤트 수신기명에 해당 메시지 데이터를 보낸다.
            //io.emit(); //서버소켓에 연결된 모든 클라이언트 사용자에게 메시지 발송함
            io.emit("receiveAll",msg);
        });

        //테스트용 서버측 이벤트 수신기 정의와 클라이언트 메시지 보내기 샘플
        //서버측/클라이언트측 이벤트 수신기명과 전달 데이터 수/포맷은 개발자가 정의합니다.(메시징설계)
        socket.on("test",async(msg)=>{
            
            io.emit("receiveTest",msg);
        });


        //채팅방 개설 및 채팅방 입장하기 기능 처리
        //사용자 채팅방 입장사실 클라이언트에 알리기
        socket.on("entry",async(channelId,nickName)=>{

        //socket.join('채팅방 고유 아이디-문자열')
        //socket.join() 동일 채널id가 없으면 해당 채팅방을 만들고 있으면 해당채널로 접속한다.
        socket.join(channelId);

        //채널 입장사실 사용자들에게 알려주기 3가지 방법

        //CASE1: 현재 접속한 사용자에게만 메시지를 보내기
        //socket.emit("클라이언트 이벤트 수신기명",전달 데이터);
        socket.emit("entryok",`${nickName} 대화명으로 입장했습니다.`);


        //CASE2: 현재 접속한 채팅방에 나를(현재 접속중인) 제외한 나머지 사용자들에게만 메시지를 보내고 싶을때
        //현재 접속자를 제외한 같은 채팅방내 모든 사용자에게 메시지 발송
        //socket.to('채널아이디').emit('클라이언트 이벤트 수신기명',전송데이터): 해당 채널에 접속중인 나를 제외한 나머지 사용자에게 알려준다.
        socket.to(channelId).emit("entryok",`${nickName}님이 채팅방에 입장했습니다`);

        //CASE3: 해당 채팅방의 나를 포함한 모든 사용자에게 메시지 보내기
        //io.to(채널명).emit('클라이언트 이벤트 수신기명',전달데이터)
        //io.to(roomId).emit("entryok",`${nickName}님이 채팅방에 입장했습니다`);


        
    
        });


        //채팅방 기준 사용자 메시지 수, 발신 처리
        socket.on("groupmsg",async(msgData)=>{

            //해당 채팅방내 모든 클라이언트로 보낼 메시지 데이터 준비
            var sendMsg = `${msgData.nickName}:${msgData.message}`;

            //해당 채널에 나를 포함한 모든 사용자에게 메시지 보내기
            io.to(msgData.channelId).emit("receiveGroupMsg",sendMsg);

        });




    });
}