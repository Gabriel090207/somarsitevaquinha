from fastapi import APIRouter
from pydantic import BaseModel

from app.config.mp import subscription_sdk

router = APIRouter()


class SubscriptionPayment(BaseModel):

    token: str

    email: str

    cpf: str

    amount: float

    card_holder: str

@router.get("/subscription-test")
def subscription_test():

    return {
        "status": "subscriptions funcionando"
    }