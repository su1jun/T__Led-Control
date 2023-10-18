window.addEventListener('DOMContentLoaded', event => {

    var path = window.location.pathname;
    var domain = window.location.hostname;
    var page = '';

    const clientIp = document.getElementById("myname").value;

    if (domain === '127.0.0.1') {
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

    var ledStatus = {
        type : false,
        red : [false, false, false, false],
        green : [false, false, false, false],
        blue : [false, false, false, false],
        ip : clientIp
    };

    var ImageDri = '/static/assets/img/'; 
    
    var mixColor = (red, green, blue) => {
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

    var mixText = (red, green, blue) => {
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

    var socket = new WebSocket('wss://' + window.location.host + '/ws/led');

    socket.addEventListener('open', () => {
        ledStatus['ip'] = clientIp;
        const message = ledStatus;
        socket.send(JSON.stringify(message));
    });
    
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event['data']);

        try {
            ledStatus['type'] = data['type'];
            ledStatus['red'] = data['red'];
            ledStatus['green'] = data['green'];
            ledStatus['blue'] = data['blue'];

            for (let i = 0; i < 4; i++) {
                let mixedColor = mixColor(ledStatus['red'][i], ledStatus['green'][i], ledStatus['blue'][i])
                let imageDriSrc = ImageDri + mixedColor + '.jpg';
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
            ledStatus = {
                red : [false, false, false, false],
                green : [false, false, false, false],
                blue : [false, false, false, false],
                ip : clientIp
            };
        }
    });
    
    socket.addEventListener('close', (event) => {
        alert("서버와의 연결이 끊여졌습니다");
    });

    document.getElementById('switch1').onclick = function() {
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

    document.getElementById('switch2').onclick = function() {
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

    document.getElementById('switch3').onclick = function() {
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

    document.getElementById('switch4').onclick = function() {
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