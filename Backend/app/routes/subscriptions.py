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

@router.post("/create-subscription")
def create_subscription(
    data: SubscriptionPayment
):

    return {
        "success": True,
        "amount": data.amount,
        "email": data.email
    }