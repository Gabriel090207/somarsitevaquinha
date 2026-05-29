import os
import mercadopago

from dotenv import load_dotenv

load_dotenv()

sdk = mercadopago.SDK(
    os.getenv("MP_ACCESS_TOKEN")
)