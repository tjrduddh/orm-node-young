//socket.io 패키지 참조
const SocketIO = require("socket.io");

//socket.io 모듈 기능 정의
module.exports = (server)=>{

    const io = SocketIO(server,{path:"/socket.io"});

    //클라이언트(웹브라우저)와 서버의 소켓서버와 연결이 완료된 상태에서 모든 메시징은 발생합니다.
    io.on("connection",(socket)=>{


        //클라이언트(웹브라우저)에서 broadcast란 서버측 이벤트 수신기를 호출하고
        //클라이언트에서 전달된 메시지를 수신한 후 다시 현재 소켓서버에 연결된 모든 클라이언트(웹브라우저) 사용자들에게
        //메시지를 발송한다
        socket.on("broadcast",function(msg){

            //io.emit() 메소드는 서버소켓과 연결된 모든 사용자에게 정의된 클라이언트 메시지 수신기로 메시지를 발송합니다.
            io.emit("receiveAll",msg);
            
        })
    });


}