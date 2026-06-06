from fastapi import APIRouter
from pydantic import BaseModel

from app.config.mp import subscription_sdk
from app.config.firebase import db
from datetime import datetime


router = APIRouter()


class SubscriptionPayment(BaseModel):

    user_id: str

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

            "back_url":
                "https://somarprototipo.netlify.app",

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

        if response["status"] != 201:

            return {
                "success": False,
                "error": response["response"]
            }

        subscription = response["response"]
        
        db.collection(
            "users"
        ).document(
            data.user_id
        ).collection(
            "subscriptions"
        ).document(
            subscription["id"]
        ).set({

            "mercado_pago_id":
                subscription["id"],

            "amount":
                float(data.amount),

            "email":
                data.email,

            "status":
                subscription.get(
                    "status"
                ),

            "created_at":
                datetime.utcnow(),

            "active":
                True,
        })

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