from fastapi import APIRouter

from app.config.mp import sdk

from app.schemas.card_payment import (
    CardPayment,
)

router = APIRouter()


@router.post("/create-card-payment")
def create_card_payment(
    data: CardPayment
):

    payment_data = {
        "transaction_amount":
            data.transaction_amount,

        "token":
            data.token,

        "description":
            "Doação Somar",

        "installments":
            data.installments,

        "payment_method_id":
            data.payment_method_id,

        "issuer_id":
            data.issuer_id,

        "payer": {
            "email":
                data.payer_email,

            "identification": {
                "type":
                    data.identification_type,

                "number":
                    data.identification_number,
            },
        },
    }

    payment_response = (
        sdk.payment().create(
            payment_data
        )
    )

    payment = payment_response["response"]

    return {
        "id": payment.get("id"),

        "status":
            payment.get("status"),

        "status_detail":
            payment.get("status_detail"),
    }