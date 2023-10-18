from fastapi import FastAPI, HTTPException, Request
from routers.myapp import my_rounter
from routers.consumer import ws_rounter
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates/")

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse("error.html", {"request": request, "exc": exc}, status_code=exc.status_code)

@app.get("/main")
async def root() -> dict:
    return {
        "message": "Hello World"
    }

app.include_router(my_rounter)
app.include_router(ws_rounter)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)