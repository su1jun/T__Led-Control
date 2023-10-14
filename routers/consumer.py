from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List
import json

class Pattern:
    def __init__(self):
        self.val = "^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$"

ws_rounter = APIRouter()

class Pin:
    def __init__(self):
        self.status = {
            "red" : [21, 21, 21, 21],
            "blue" : [21, 21, 21, 21],
            "green" : [21, 21, 21, 21],
            "fan" : [21, 21],
        }

class LED:
    def __init__(self):
        self.status = {
            "red": [False, False, False, False],
            "green": [False, False, False, False],
            "blue": [False, False, False, False]
        }

class FAN:
    def __init__(self):
        self.status = {
            "power": False,
            "speed": '0'
        }

led = LED()
fan = FAN()
pin = Pin()

# led panel handshake
clients_led: List[WebSocket] = [] 
@ws_rounter.websocket("/ws/led")
async def websocket_endpoint(websocket: WebSocket):
    
    await websocket.accept()
    await websocket.send_text(json.dumps(led.status))
    clients_led.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)

            for pin_color in data:
                for idx, pin in enumerate(data[pin_color]):

                    if type(pin) == bool:
                        if led.status[pin_color][idx] != pin: # find changed pin
                            led.status[pin_color][idx] = pin
                    else:
                        raise HTTPException(status_code=400, detail="request is invalid")

            for client in clients_led:
                await client.send_text(json.dumps(led.status))

    except WebSocketDisconnect:
        clients_led.remove(websocket)

# fan panel handshake
clients_fan: List[WebSocket] = [] 
@ws_rounter.websocket("/ws/rs/fan")
async def websocket_endpoint(websocket: WebSocket):
    
    await websocket.accept()
    await websocket.send_text(json.dumps(fan.status))
    clients_fan.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            data = json.loads(data)
            if type(data['power']) == bool:
                if fan.status['power'] != data['power']:
                    fan.status['power'] = data['power']
            else:
                raise HTTPException(status_code=400, detail="request is invalid")

            if type(data['speed']) == str:
                if 0 <= int(data['speed']) and int(data['speed']) <= 100:
                    if fan.status['speed'] != data['speed']:
                        fan.status['speed'] = data['speed']
            else:
                raise HTTPException(status_code=400, detail="request is invalid")

            for client in clients_fan:
                await client.send_text(json.dumps(fan.status))
                
    except WebSocketDisconnect:
        clients_fan.remove(websocket)

