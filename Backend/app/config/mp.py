import os
import mercadopago

from dotenv import load_dotenv

load_dotenv()

sdk = mercadopago.SDK(
    os.getenv("MP_ACCESS_TOKEN")
)

subscription_sdk = mercadopago.SDK(
    os.getenv("MP_SUBSCRIPTION_ACCESS_TOKEN")
)