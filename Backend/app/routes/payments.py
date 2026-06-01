from fastapi import APIRouter
from pydantic import BaseModel

from app.config.mp import sdk

from app.config.firebase import db

from datetime import datetime

from google.cloud.firestore_v1 import Increment

router = APIRouter()


class PixPayment(BaseModel):
    amount: float
    email: str


class ConfirmDonation(BaseModel):
    campaign_id: str

    campaign_title: str

    amount: float

    donor_name: str

    donor_email: str

    payment_method: str

class CardPayment(BaseModel):
    token: str
    issuer_id: int | None = None
    payment_method_id: str | None = None
    installments: int
    amount: float
    email: str
    campaign_id: str
    campaign_title: str
    donor_name: str
    cpf: str
    expiration_month: int
    expiration_year: int

@router.post("/create-pix")
def create_pix(data: PixPayment):

    payment_data = {
        "transaction_amount": data.amount,

        "description": "Doação Somar",

        "payment_method_id": "pix",

        "payer": {
            "email": data.email
        }
    }

    payment_response = sdk.payment().create(
        payment_data
    )

    payment = payment_response["response"]

    return {
        "id": payment["id"],

        "status": payment["status"],

        "qr_code":
            payment["point_of_interaction"]
            ["transaction_data"]
            ["qr_code"],

        "qr_code_base64":
            payment["point_of_interaction"]
            ["transaction_data"]
            ["qr_code_base64"],

        "ticket_url":
            payment["point_of_interaction"]
            ["transaction_data"]
            ["ticket_url"],
    }

@router.get("/payment-status/{payment_id}")
def payment_status(payment_id: str):

    payment_response = sdk.payment().get(
        payment_id
    )

    payment = payment_response["response"]

    return {
        "status": payment["status"]
    }

@router.post("/confirm-donation")
def confirm_donation(data: ConfirmDonation):

    donation_ref = db.collection(
        "donations"
    ).document()

    donation_ref.set({

        "campaignId":
            data.campaign_id,

        "campaignTitle":
            data.campaign_title,

        "amount":
            data.amount,

        "donorName":
            data.donor_name,

        "donorEmail":
            data.donor_email,

        "paymentMethod":
            data.payment_method,

        "status":
            "approved",

        "createdAt":
            datetime.utcnow(),
    })

    campaign_ref = db.collection(
        "campaigns"
    ).document(data.campaign_id)

    campaign_ref.update({

        "raisedAmount":
            Increment(data.amount)
    })

    return {
        "success": True
    }

@router.post("/create-card-payment")
def create_card_payment(
    data: CardPayment
):

    payment_data = {

        "transaction_amount":
            data.amount,

        "token":
            data.token,

        "description":
            data.campaign_title,

        "installments":
            data.installments,

        "payer": {

            "email":
                data.email,

            "identification": {

                "type":
                    "CPF",

                "number":
                    data.cpf
            }
        }
    }



    print("EXP MONTH:", data.expiration_month)
    print("EXP YEAR:", data.expiration_year)

    print("PAYMENT DATA:")
    print(payment_data)

    payment_response = sdk.payment().create(
        payment_data
    )


    print("MP RESPONSE:")
    print(payment_response)

    payment = payment_response["response"]

    if payment["status"] == "approved":

        donation_ref = db.collection(
            "donations"
        ).document()

        donation_ref.set({

            "campaignId":
                data.campaign_id,

            "campaignTitle":
                data.campaign_title,

            "amount":
                data.amount,

            "donorName":
                data.donor_name,

            "donorEmail":
                data.email,

            "paymentMethod":
                "credit_card",

            "status":
                "approved",

            "createdAt":
                datetime.utcnow(),
        })

        campaign_ref = db.collection(
            "campaigns"
        ).document(data.campaign_id)

        campaign_ref.update({

            "raisedAmount":
                Increment(data.amount)
        })

    print("ROTA PAYMENTS.PY EXECUTADA")

    return {
        "status":
            payment["status"]
    }