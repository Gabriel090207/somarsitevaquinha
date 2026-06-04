from fastapi import APIRouter
from pydantic import BaseModel

from app.config.mp import subscription_sdk
from app.config.firebase import db
from datetime import datetime


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

    try:

        subscription_data = {

            "reason":
                "Doação Mensal Somar",

            "payer_email":
                data.email,

            "card_token_id":
                data.token,

            "auto_recurring": {

                "frequency": 1,

                "frequency_type":
                    "months",

                "transaction_amount":
                    float(data.amount),

                "currency_id":
                    "BRL"
            },

            "status":
                "authorized"
        }

        response = subscription_sdk.preapproval().create(
            subscription_data
        )

        print(response)

        return {
            "success": True,
            "subscription":
                response["response"]
        }

    except Exception as e:

        print(
            "ERRO ASSINATURA:",
            str(e)
        )

        return {
            "success": False,
            "error":
                str(e)
        }