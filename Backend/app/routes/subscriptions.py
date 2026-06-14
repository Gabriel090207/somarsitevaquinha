from fastapi import APIRouter
from pydantic import BaseModel

from app.config.mp import subscription_sdk
from app.config.firebase import db
from datetime import datetime

from google.cloud.firestore_v1 import Increment


router = APIRouter()


class SubscriptionPayment(BaseModel):

    user_id: str

    token: str

    email: str

    cpf: str

    amount: float

    card_holder: str


class UpdateSubscriptionStatus(BaseModel):

    user_id: str

    subscription_id: str

    active: bool

class UpdateSubscriptionAmount(
    BaseModel
):

    user_id: str

    subscription_id: str

    amount: float


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


            "user_id":
                data.user_id,


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

            "next_payment_date":
                subscription.get(
                    "next_payment_date"
                ),

            "reason":
                subscription.get(
                    "reason"
                ),

            "active":
                True,

            "last_credit_at":
                None,
        })


        wallet_ref = (
            db.collection("users")
            .document(data.user_id)
            .collection("wallet")
            .document("main")
        )

        wallet_doc = wallet_ref.get()

        if not wallet_doc.exists:

            wallet_ref.set({

                "balance":
                    0,

                "created_at":
                    datetime.utcnow(),

                "updated_at":
                    datetime.utcnow(),
            })

        wallet_ref.update({

            "balance":
                Increment(
                    float(data.amount)
                ),

            "updated_at":
                datetime.utcnow(),
        })


        db.collection(
            "users"
        ).document(
            data.user_id
        ).collection(
            "walletTransactions"
        ).add({

            "type":
                "subscription_credit",

            "amount":
                float(data.amount),

            "description":
                "Primeira cobrança da assinatura",

            "subscription_id":
                subscription["id"],

            "created_at":
                datetime.utcnow(),
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



@router.post(
    "/update-subscription-status"
)
def update_subscription_status(
    data: UpdateSubscriptionStatus
):

    try:

        status = (
            "authorized"
            if data.active
            else "paused"
        )

        response = (
            subscription_sdk
            .preapproval()
            .update(
                data.subscription_id,
                {
                    "status":
                        status
                }
            )
        )

        print("=" * 50)
        print(
            "UPDATE ASSINATURA"
        )
        print(response)
        print("=" * 50)

        if response["status"] not in [
            200,
            201,
        ]:

            return {

                "success":
                    False,

                "error":
                    response
            }


        db.collection(
            "users"
        ).document(
            data.user_id
        ).collection(
            "subscriptions"
        ).document(
            data.subscription_id
        ).update({

            "active":
                data.active,

            "status":
                status,
        })

        return {

            "success":
                True
        }

    except Exception as e:

        print(
            "ERRO UPDATE SUB:",
            str(e)
        )

        return {

            "success":
                False,

            "error":
                str(e)
        }


from fastapi import Request


@router.post(
    "/subscription-webhook"
)
async def subscription_webhook(
    request: Request
):

    try:

        body = await request.json()

        print("=" * 50)
        print("WEBHOOK ASSINATURA")
        print(body)
        print("=" * 50)

        return {
            "success": True
        }

    except Exception as e:

        print(
            "ERRO WEBHOOK ASSINATURA:",
            str(e)
        )

        return {
            "success": False
        }


@router.post(
    "/update-subscription-amount"
)
def update_subscription_amount(
    data: UpdateSubscriptionAmount
):

    try:

        response = (
            subscription_sdk
            .preapproval()
            .update(
                data.subscription_id,
                {
                    "auto_recurring": {

                        "transaction_amount":
                            float(
                                data.amount
                            ),

                        "currency_id":
                            "BRL"
                    }
                }
            )
        )

        print("=" * 50)
        print(
            "UPDATE VALOR ASSINATURA"
        )
        print(response)
        print("=" * 50)

        if response["status"] not in [
            200,
            201,
        ]:

            return {

                "success":
                    False,

                "error":
                    response
            }

        db.collection(
            "users"
        ).document(
            data.user_id
        ).collection(
            "subscriptions"
        ).document(
            data.subscription_id
        ).update({

            "amount":
                float(
                    data.amount
                )
        })

        return {

            "success":
                True
        }

    except Exception as e:

        print(
            "ERRO UPDATE VALOR:",
            str(e)
        )

        return {

            "success":
                False,

            "error":
                str(e)
        }