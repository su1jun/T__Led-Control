window.addEventListener('DOMContentLoaded', event => {

    var FanStatus = { // 라베 팬 상태
        power : false,
        speed : 50,
    };

    var ImageDri = '/static/assets/img/';  // 이미지 고정 경로

    var socket = new WebSocket('wss://' + window.location.host + '/ws/rs/fan'); // websocket handler

    socket.addEventListener('open', () => { // open websocket
        // console.log('WebSocket 연결이 열렸습니다.');
    });
    
    socket.addEventListener('message', (event) => { // recieve websocket
        const data = JSON.parse(event['data']);
        // console.log('data from server: ', data);

        try {
            FanStatus['power'] = data['power'];
            FanStatus['temp'] = data['temp'];
            FanStatus['speed'] = data['speed'];

            if (FanStatus['power']) {
                document.getElementById('image1').src = ImageDri + 'fan_on.jpg';
                document.getElementById('title1').style.color = "#0035E0";
                document.getElementById('text1').textContent = 'On';
            } else {
                document.getElementById('image1').src = ImageDri + 'fan_off.jpg';
                document.getElementById('title1').style.color = "gray";
                document.getElementById('text1').textContent = 'Off';
            }
            
            let slider = document.getElementById("slider");
            let sliderValue = document.getElementById("sliderValue");
            slider.value = FanStatus['speed'];
            sliderValue.innerHTML = FanStatus['speed'];
            
            let absoluteSaturationValue = FanStatus['speed'] / 1 + 100;
            document.getElementById("image2").style.filter = "saturate(" + absoluteSaturationValue + "%)";
            document.getElementById('title2').style.filter = "saturate(" + absoluteSaturationValue + "%)";

        } catch(error) {
            // console.log('데이터 형식이 안맞거나, 이미지가 참조 안됨');
            // console.log('FanStatus', FanStatus);
            // console.log(error);
            FanStatus = { // 라베 팬 상태
                power : false,
                speed : 0,
            };  
        }
    });
    
    socket.addEventListener('close', (event) => { // close websocket
        alert("서버와의 연결이 끊여졌습니다");
        // console.log('WebSocket 연결이 종료되었습니다.');
    });

    // 사용자 이미지 클릭시 이벤트
    document.getElementById('switch1').onclick = function() { // click image1 (switch1)
        FanStatus['power'] = !FanStatus['power']
        // console.log('FanStatus', FanStatus);
        const message = FanStatus;
        socket.send(JSON.stringify(message));
    };

    // 사용자 버튼 클릭시 이벤트
    document.getElementById("myButton").onclick = function() {
        var spanValue = document.getElementById("sliderValue").textContent;
        FanStatus['speed'] = spanValue;
        // console.log('FanStatus', FanStatus);
        const message = FanStatus;
        socket.send(JSON.stringify(message));
    };
});