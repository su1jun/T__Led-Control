window.addEventListener('DOMContentLoaded', event => {

    const clientIp = document.getElementById("myname").value;

    var rasSatus = {
        type : false,
        speed : '0',
        string : '',
        ip : clientIp
    }

    var ImageDri = '/static/assets/img/';

    var socket = new WebSocket('wss://' + window.location.host + '/ws/ras');

    socket.addEventListener('open', () => {
        rasSatus['ip'] = clientIp;
        const message = rasSatus;
        socket.send(JSON.stringify(message));
    });
    
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event['data']);

        try {
            rasSatus['type'] = data['type'];
            rasSatus['speed'] = data['speed'];
            rasSatus['string'] = data['string'];
            
            let slider = document.getElementById("slider");
            let sliderValue = document.getElementById("sliderValue");
            slider.value = rasSatus['speed'];
            sliderValue.innerHTML = rasSatus['speed'];
            
            if (rasSatus['speed'] > 0) {
                document.getElementById("image2").src = ImageDri + 'fan.jpg';
                document.getElementById("title2").style.color = "#3900E1";

                let absoluteSaturationValue = rasSatus['speed'] / 0.8 + 100;
                document.getElementById("image2").style.filter = "saturate(" + absoluteSaturationValue + "%)";
                document.getElementById('title2').style.filter = "saturate(" + absoluteSaturationValue + "%)";
            } else {
                document.getElementById("image2").src = ImageDri + 'fan_off.jpg';
                document.getElementById("title2").style.color = "gray";
            }

            document.getElementById('text1').textContent = rasSatus['string']

        } catch(error) {
            rasSatus = {
                type : false,
                speed : '0',
                string : '',
                ip : clientIp
            }
        }
    });
    
    socket.addEventListener('close', (event) => {
        alert("서버와의 연결이 끊여졌습니다");
    });

    document.getElementById("myButton").onclick = function() {
        var spanValue = document.getElementById("sliderValue").textContent;
        rasSatus['speed'] = spanValue;
        const message = rasSatus;
        socket.send(JSON.stringify(message));
    };

    const nameInput = document.getElementById("nameForm");
    const errorMsg = document.getElementById("errorMsg");
    const submitButton = document.getElementById("submitButton");
    const regex = /^[a-zA-Z0-9;:,.?!-_()*%#\s]{0,16}$/;
    
    stringForm.addEventListener("input", function() {
        if (regex.test(stringForm.value)) {
            errorMsg.style.display = "none";
            submitButton.disabled = false;
        } else {
            errorMsg.style.display = "block";
            submitButton.disabled = true;
        }
    });

    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        var inputStr = document.getElementById("stringForm").value;

        rasSatus['string'] = inputStr;

        const message = rasSatus;
        socket.send(JSON.stringify(message));
    });
});