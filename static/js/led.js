window.addEventListener('DOMContentLoaded', event => {

    var path = window.location.pathname;
    var domain = window.location.hostname;
    var page = '';
    if (domain === '127.0.0.1') {
        // 개발 환경일 때의 코드
        if (path === "/") {
            page = 'gray';
        } else if (path === "/red") {
            page = 'red';
        } else if (path === "/green") {
            page = 'green';
        } else if (path === "/blue") {
            page = 'blue';
        }
    } else {
        // 배포 환경일 때의 코드
        if (path === "/") {
            page = 'gray';
        } else if (path === "/red") {
            page = 'red';
        } else if (path === "/green") {
            page = 'green';
        } else if (path === "/blue") {
            page = 'blue';
        }
    }

    var ledStatus = { // 라베 LED 상태
        red : [false, false, false, false],
        green : [false, false, false, false],
        blue : [false, false, false, false],
    };

    var ImageDri = '/static/assets/img/';  // 이미지 고정 경로

    var mixColor = (red, green, blue) => { // 색 조합 함수
        if (red) {
            if (blue) {
                if (green) {
                    return 'white';
                } else {
                    return 'magenta';
                }
            } else {
                if (green) {
                    return 'yellow';
                } else {
                    return 'red';
                }
            }
        } else {
            if (blue) {
                if (green) {
                    return 'cyan';
                } else {
                    return 'blue';
                }
            } else {
                if (green) {
                    return 'green';
                } else {
                    return 'gray';
                }
            }
        }
    }

    var mixText = (red, green, blue) => { // 색 표시 텍스트 완성 함수
        if (red) {
            if (blue) {
                if (green) {
                    return 'Red + Green + Blue';
                } else {
                    return 'Red + Blue';
                }
            } else {
                if (green) {
                    return 'Red + Green';
                } else {
                    return 'Red';
                }
            }
        } else {
            if (blue) {
                if (green) {
                    return 'Green + Blue';
                } else {
                    return 'Blue';
                }
            } else {
                if (green) {
                    return 'Green';
                } else {
                    return 'None';
                }
            }
        }
            
    }

    var socket = new WebSocket('ws://' + window.location.host + '/ws/led'); // websocket handler

    socket.addEventListener('open', () => { // open websocket
        // console.log('WebSocket 연결이 열렸습니다.');
    });
    
    socket.addEventListener('message', (event) => { // recieve websocket
        const data = JSON.parse(event['data']);
        // console.log('data from server: ', data);

        try {
            ledStatus['red'] = data['red'];
            ledStatus['green'] = data['green'];
            ledStatus['blue'] = data['blue'];

            for (let i = 0; i < 4; i++) {
                let mixedColor = mixColor(ledStatus['red'][i], ledStatus['green'][i], ledStatus['blue'][i])
                let imageDriSrc = ImageDri + mixedColor + '.jpg';
                // console.log('imageDriSrc', imageDriSrc);
                // console.log('image' + (i+1));
                document.getElementById('image' + (i+1)).src = imageDriSrc;

                if (mixedColor == 'yellow') {
                    document.getElementById('title' + (i+1)).style.color = "#E0D100";
                } else if (mixedColor == 'white') {
                    document.getElementById('title' + (i+1)).style.color = "#dddddd";
                } else {
                    document.getElementById('title' + (i+1)).style.color = mixedColor;
                }
                
                document.getElementById('text' + (i+1)).textContent = mixText(ledStatus['red'][i], ledStatus['green'][i], ledStatus['blue'][i]);
            }
        } catch(error) {
            // console.log('데이터 형식이 안맞거나, 이미지가 참조 안됨');
            // console.log('ledStatus', ledStatus);
            // console.log(error);
            ledStatus = { // 라베 LED 상태
                red : [false, false, false, false],
                green : [false, false, false, false],
                blue : [false, false, false, false],
            };
        }
    });
    
    socket.addEventListener('close', (event) => { // close websocket
        alert("서버와의 연결이 끊여졌습니다");
        // console.log('WebSocket 연결이 종료되었습니다.');
    });

    // 사용자 이미지 클릭시 이벤트
    document.getElementById('switch1').onclick = function() { // click image1 (switch1)
        if (page=='gray') {
            ledStatus['red'][0] = false;
            ledStatus['green'][0] = false;
            ledStatus['blue'][0] = false;
        } else {
            ledStatus[page][0] = !ledStatus[page][0];
        }
        const message = ledStatus;
        socket.send(JSON.stringify(message));
    };

    document.getElementById('switch2').onclick = function() { // click image2 (switch2)
        if (page=='gray') {
            ledStatus['red'][1] = false;
            ledStatus['green'][1] = false;
            ledStatus['blue'][1] = false;
        } else {
            ledStatus[page][1] = !ledStatus[page][1]
        }
        const message = ledStatus;
        socket.send(JSON.stringify(message));
    };

    document.getElementById('switch3').onclick = function() { // click image3 (switch3)
        if (page=='gray') {
            ledStatus['red'][2] = false;
            ledStatus['green'][2] = false;
            ledStatus['blue'][2] = false;
        } else {
            ledStatus[page][2] = !ledStatus[page][2];
        }
        const message = ledStatus;
        socket.send(JSON.stringify(message));
    };

    document.getElementById('switch4').onclick = function() { // click image4 (switch4)
        if (page=='gray') {
            ledStatus['red'][3] = false;
            ledStatus['green'][3] = false;
            ledStatus['blue'][3] = false;
        } else {
            ledStatus[page][3] = !ledStatus[page][3];
        }
        const message = ledStatus;
        socket.send(JSON.stringify(message));
    };
});