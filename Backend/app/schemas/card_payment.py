from pydantic import BaseModel


class CardPayment(BaseModel):
    token: str
    issuer_id: str
    payment_method_id: str
    transaction_amount: float
    installments: int

    payer_email: str

    identification_type: str
    identification_number: str