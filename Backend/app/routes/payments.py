from fastapi import APIRouter, Body
from pydantic import BaseModel

from app.config.mp import sdk

from app.config.firebase import db

from datetime import datetime

from google.cloud.firestore_v1 import Increment

router = APIRouter()


class PixPayment(BaseModel):

    amount: float

    email: str

    campaign_id: str

    campaign_title: str

    donor_name: str


class ConfirmDonation(BaseModel):

    payment_id: int

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
    expiration_month: int | None = None
    expiration_year: int | None = None

class WalletDonation(BaseModel):

    campaign_id: str

    campaign_title: str

    amount: float

    donor_name: str

    donor_email: str


@router.post("/create-pix")
def create_pix(data: PixPayment):

    payment_data = {

        "transaction_amount":
            data.amount,

        "external_reference":
            data.campaign_id,

        "metadata": {

            "campaign_id":
                data.campaign_id,

            "campaign_title":
                data.campaign_title,

            "donor_name":
                data.donor_name,

            "donor_email":
                data.email,
        },

        "description":
            "Doação Somar",

        "payment_method_id":
            "pix",

        "payer": {
            "email":
                data.email
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

    existing_donations = (
        db.collection("donations")
        .where(
            "paymentId",
            "==",
            data.payment_id
        )
        .limit(1)
        .get()
    )

    if len(existing_donations) > 0:

        return {
            "success": True,
            "message":
                "Doação já registrada"
        }

    donation_ref = db.collection(
        "donations"
    ).document()

    donation_ref.set({

        "paymentId":
            data.payment_id,

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
            float(data.amount),

        "token":
            data.token,

        "description":
            data.campaign_title,

        "installments":
            data.installments,

        "payment_method_id":
            data.payment_method_id,

        "issuer_id":
            data.issuer_id,

        "metadata": {

            "campaign_id":
                data.campaign_id,

            "campaign_title":
                data.campaign_title,

            "donor_name":
                data.donor_name,

            "donor_email":
                data.email,
        },

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



    print("=" * 50)
    print("EXP MONTH:", data.expiration_month)
    print("EXP YEAR:", data.expiration_year)
    print("TOKEN:", data.token)
    print("=" * 50)

    print("PAYMENT DATA:")
    print(payment_data)

    print("=" * 50)
    print("PAYMENT DATA ENVIADO AO MP")
    print(payment_data)
    print("=" * 50)

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


             "paymentId":
                payment["id"],

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

       
    print("ROTA PAYMENTS.PY EXECUTADA")

    return {
        "status":
            payment["status"]
    }



@router.post("/wallet-donation")
def wallet_donation(
    data: WalletDonation
):

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
            "wallet",

        "status":
            "approved",

        "createdAt":
            datetime.utcnow(),
    })

    return {
        "success": True
    }
    
from fastapi import Request

@router.post("/webhook")
async def mercadopago_webhook(
    request: Request
):

    try:

        payment_id = request.query_params.get(
            "data.id"
        )

        if not payment_id:

            return {
                "success": True
            }

        payment_response = (
            sdk.payment().get(
                payment_id
            )
        )

        payment = (
            payment_response["response"]
        )

        print("=" * 50)
        print("WEBHOOK PAYMENT:")
        print(payment)
        print("=" * 50)

        if (
            payment["status"]
            != "approved"
        ):

            return {
                "success": True
            }

        if (
            payment.get("payment_type_id")
            == "credit_card"
        ):

            return {
                "success": True,
                "message":
                    "Pagamento com cartão já registrado pela rota de cartão"
            }

        existing_donations = (
            db.collection("donations")
            .where(
                "paymentId",
                "==",
                int(payment_id)
            )
            .limit(1)
            .get()
        )

        if len(existing_donations) > 0:

            return {
                "success": True,
                "message":
                    "Doação já registrada"
            }

        metadata = (
            payment.get("metadata", {})
        )

        campaign_id = (
            metadata.get(
                "campaign_id"
            )
        )

        campaign_title = (
            metadata.get(
                "campaign_title"
            )
        )

        donor_name = (
            metadata.get(
                "donor_name"
            )
        )

        donor_email = (
            metadata.get(
                "donor_email"
            )
        )

        amount = (
            payment.get(
                "transaction_amount",
                0
            )
        )

        donation_ref = (
            db.collection(
                "donations"
            ).document()
        )

        donation_ref.set({

            "paymentId":
                int(payment_id),

            "campaignId":
                campaign_id,

            "campaignTitle":
                campaign_title,

            "amount":
                amount,

            "donorName":
                donor_name,

            "donorEmail":
                donor_email,

            "paymentMethod":
                payment.get(
                    "payment_method_id",
                    "unknown"
                ),

            "status":
                "approved",

            "createdAt":
                datetime.utcnow(),
        })

        campaign_ref = (
            db.collection(
                "campaigns"
            ).document(
                campaign_id
            )
        )

        campaign_ref.update({

            "raisedAmount":
                Increment(amount)
        })

        return {
            "success": True
        }

    except Exception as e:

        print(
            "ERRO WEBHOOK:",
            str(e)
        )

        return {
            "success": False
        }