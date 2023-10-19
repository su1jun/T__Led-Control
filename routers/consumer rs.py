from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
import json, re
import RPi.GPIO as GPIO
import RPi_I2C_driver
import threading, time

ws_rounter = APIRouter() # domain rounter
is_thread_running = False

# Instantiate variables
class Pattern:
    def __init__(self):
        self.val = "^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$"

class PIN:
    def __init__(self):
        self.status = {
            "red" : [18, 19, 13, 6],
            "green" : [5, 11, 9, 10],
            "blue" : [8, 17, 7, 25],
            "etc" : [26, 16, 20, 21],
        }

class LED:
    def __init__(self):
        self.status = {
            "type": '1',
            "red": [False, False, False, False],
            "green": [False, False, False, False],
            "blue": [False, False, False, False]
        }

class RAS:
    def __init__(self):
        self.status = {
            "type" : '2',
            "speed" : '0',
            "string" : ''
        }
        self.client_ip = {} # ip
        

led = LED()
ras = RAS()
pin = PIN()
mylcd = RPi_I2C_driver.lcd()

# set up pin 
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
 
# connet pin
# motorAIAPwm = GPIO.PWM(pin.status['fan'][0], 500)
# motorAIAPwm.start(0)

# motorAIBPwm = GPIO.PWM(pin.status['fan'][1], 500)
# motorAIBPwm.start(0)

for pin_color in ["red", "green", "blue"]:
    for idx, p in enumerate(pin.status[pin_color]):
        GPIO.setup(p, GPIO.OUT)
        GPIO.output(p, led.status[pin_color][idx])
for idx, p in enumerate(pin.status["etc"]):
    GPIO.setup(p, GPIO.OUT)
    GPIO.output(p, True)

class MyThread(threading.Thread):
    def __init__(self, x, state):
        threading.Thread.__init__(self)
        self.freq = 0
        self.state = state
        self.pins = pin.status
        self.daemon = True
        self._is_running = True
        
    def run(self):
        while self._is_running:
            if self.freq != 0:
                for pin_color in ["red", "green", "blue", "etc"]:
                    for idx, p in enumerate(self.pins[pin_color]):
                        GPIO.setup(p, GPIO.OUT)
                        GPIO.output(p, False)
                time.sleep(self.freq)
                for pin_color in ["red", "green", "blue"]:
                    for idx, p in enumerate(self.pins[pin_color]):
                        GPIO.setup(p, GPIO.OUT)
                        GPIO.output(p, self.state[pin_color][idx])
                for idx, p in enumerate(self.pins["etc"]):
                    GPIO.setup(p, GPIO.OUT)
                    GPIO.output(p, True)
                # print(f"_is_running {self._is_running}")
                current_thread = threading.current_thread()
                # print(f"cur thread name: {current_thread.name}")
                # print(f"cur thread obj: {current_thread}")
                time.sleep(self.freq)
            else:
                for pin_color in ["red", "green", "blue"]:
                    for idx, p in enumerate(self.pins[pin_color]):
                        GPIO.setup(p, GPIO.OUT)
                        GPIO.output(p, self.state[pin_color][idx])
                time.sleep(0.2)
            
    
    def update_state(self, new_state):
        self.state = new_state
        
    def update_freq(self, x):
        x = int(x)
        if x == 0:
            self.freq = 0
        else:
            self.freq = (x + 20) / 50
        
    def stop(self):
        self._is_running = False
        print(f"stop_is_running {self._is_running}")
        for pin_color in ["red", "green", "blue"]:
            for idx, p in enumerate(self.pins[pin_color]):
                GPIO.setup(p, GPIO.OUT)
                GPIO.output(p, self.state[pin_color][idx])
        
if not is_thread_running:
    is_thread_running = True
    my_thread = MyThread(ras.status["speed"], led.status)
    my_thread.start()
    
# led panel handshake
@ws_rounter.websocket("/ws/led")
async def websocket_endpoint_led(websocket: WebSocket):
    
    # accept signal
    await websocket.accept()
    await websocket.send_text(json.dumps(led.status))

    try:
        while True:
            # wait receive data
            data = await websocket.receive_text()
            data = json.loads(data)
            
            if data['type'] == '1':
                # led update
                for pin_color in data:
                    if type(data[pin_color]) == list:
                        for idx, p in enumerate(data[pin_color]):

                            if type(p) == bool:
                                led.status[pin_color][idx] = p
                            else:
                                raise HTTPException(status_code=400, detail="request is invalid")
                        my_thread.update_state(led.status)
                        # print(f"led.status : {led.status}")
                        
            elif data['type'] == '0': # add new ip address
                if data['ip'] not in ras.client_ip:
                    ras.client_ip[websocket] = data['ip']
                
                    # print(f"new add {ras.client_ip}")
            lcd_ip = ras.client_ip[websocket]
            lcd_ip = ((16 - len(lcd_ip)) // 2 * ' ') + lcd_ip
            mylcd.lcd_display_string(lcd_ip, 1)
            
            # led status broadcast
            for client in ras.client_ip:
                await client.send_text(json.dumps(led.status))
            
            # print(f"broadcast list {ras.client_ip}")

    except WebSocketDisconnect:
        del ras.client_ip[websocket]

# ras panel handshake
@ws_rounter.websocket("/ws/ras")
async def websocket_endpoint_ras(websocket: WebSocket):
    
    await websocket.accept()
    await websocket.send_text(json.dumps(ras.status))
    
    try:
        while True:
            # wait receive data
            data = await websocket.receive_text()
            data = json.loads(data)
            
            if data['type'] == '2':
                # name update
                if type(data['string']) == str: # check input
                    pattern = r'^[a-zA-Z0-9;:,.?!-_()*%#\s]{0,16}$'
                    if re.match(pattern, data['string']):
                        ras.status["string"] = data['string']
                        lcd_text = ras.status["string"]
                        lcd_text = ((16 - len(lcd_text)) // 2 * ' ') + lcd_text
                        mylcd.lcd_display_string(lcd_text, 2)
                
                else:
                    raise HTTPException(status_code=400, detail="request is invalid")
                # fan update
                if type(data['speed']) == str: # check input
                    if 0 <= int(data['speed']) and int(data['speed']) <= 100:
                        ras.status["speed"] = data['speed']
                        my_thread.update_freq(ras.status["speed"])
                else:
                    raise HTTPException(status_code=400, detail="request is invalid")
                
            elif data['type'] == '0': # add new ip address
                # print(f"all ip {ras.client_ip}")
                if data['ip'] not in ras.client_ip:
                    ras.client_ip[websocket] = data['ip']
                    
                    # print(f"new add {ras.client_ip}")
                    # print(f"all ip {ras.client_ip}")
            lcd_ip = ras.client_ip[websocket]
            lcd_ip = ((16 - len(lcd_ip)) // 2 * ' ') + lcd_ip
            mylcd.lcd_display_string(lcd_ip, 1)

            # ras status broadcast
            for client in ras.client_ip:
                # print(f"보냄 {ras.status}")
                await client.send_text(json.dumps(ras.status))

            # print(f"broadcast list {ras.client_ip}")

    except WebSocketDisconnect:
        del ras.client_ip[websocket]
