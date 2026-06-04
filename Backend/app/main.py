from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.mp import sdk

from app.routes.payments import router as payments_router
from app.routes.subscriptions import router as subscriptions_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments_router)
app.include_router(subscriptions_router)

@app.get("/")
def home():
    return {
        "message": "Backend Somar funcionando"
    }

@app.get("/mp-test")
def mp_test():

    return {
        "status": "Mercado Pago conectado"
    }