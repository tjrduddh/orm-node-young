//콜백지옥
//콜백함수의 한계: 콜백지옥..그래서 promise -> 그래서 async/await 문법을 이용해
//콜백함수의 콜백지옥을 벗어나자 자유롭게 비동기 프로그래밍 환경에서
//순차/절차 기반 프로그래밍을 손쉽게 해보자



//순서대로 함수를 실행하려면 함수 안에 함수를 넣어야한다
//지옥
var fnHell = function(){
    
    console.log("로직1 완료");

    //2번째로직 구현함수
    setTimeout(function(){
        console.log("로직2 완료");

        //3번째로직 구현함수
        setTimeout(function(){
            console.log("로직3 완료");

            //4번째로직 구현함수
            setTimeout(function(){
                console.log("로직4 완료");

                //5번째로직 구현함수
                setTimeout(function(){
                    console.log("로직5 완료");
                },1000);

            },1000);

        },1000);

    },1000);


}

//천국
var fnHeaven = function(){
    console.log("로직1 완료");

    //2번째로직 구현함수
    setTimeout(function(){
        console.log("로직2 완료");
    },1000);

    //3번째로직 구현함수
    setTimeout(function(){
        console.log("로직3 완료");
    },2000);

    //4번째로직 구현함수
    setTimeout(function(){
        console.log("로직4 완료");
    },3000);

    //5번째로직 구현함수
    setTimeout(function(){
        console.log("로직5 완료");
    },4000);

    
}


//지옥을 불러오자
//fnHell();

//우리(개발자)가 원하는바는 천국
fnHeaven();