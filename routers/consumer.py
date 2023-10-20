from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
import json, re

ws_router = APIRouter() # domain rounter
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
 
# led panel handshake
@ws_router.websocket("/ws/led")
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
                        
            elif data['type'] == '0': # add new ip address
                if data['ip'] not in ras.client_ip:
                    ras.client_ip[websocket] = data['ip']
                
            lcd_ip = ras.client_ip[websocket]
            lcd_ip = ((16 - len(lcd_ip)) // 2 * ' ') + lcd_ip
            
            # led status broadcast
            for client in ras.client_ip:
                await client.send_text(json.dumps(led.status))
            

    except WebSocketDisconnect:
        del ras.client_ip[websocket]

# ras panel handshake
@ws_router.websocket("/ws/ras")
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
                
                else:
                    raise HTTPException(status_code=400, detail="request is invalid")
                # fan update
                if type(data['speed']) == str: # check input
                    if 0 <= int(data['speed']) and int(data['speed']) <= 100:
                        ras.status["speed"] = data['speed']
                else:
                    raise HTTPException(status_code=400, detail="request is invalid")
                
            elif data['type'] == '0': # add new ip address
                if data['ip'] not in ras.client_ip:
                    ras.client_ip[websocket] = data['ip']
                    
            lcd_ip = ras.client_ip[websocket]
            lcd_ip = ((16 - len(lcd_ip)) // 2 * ' ') + lcd_ip

            # ras status broadcast
            for client in ras.client_ip:
                await client.send_text(json.dumps(ras.status))


    except WebSocketDisconnect:
        del ras.client_ip[websocket]
