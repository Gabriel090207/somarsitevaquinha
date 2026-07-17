from fastapi import APIRouter
from fastapi import Request
from fastapi import Body

import requests


from app.config.asaas import (
    ASAAS_API_KEY
)

router = APIRouter(
    prefix="/asaas",
    tags=["Asaas"]
)


@router.get("/test")
def asaas_test():

    return {
        "status": "Rota Asaas funcionando",
        "apiKeyLoaded":
            bool(ASAAS_API_KEY)
    }

@router.get("/account")
def get_account():

    response = requests.get(
        "https://api.asaas.com/v3/myAccount",
        headers={
            "access_token": ASAAS_API_KEY
        }
    )

    return response.json()


@router.get("/subaccounts")
def list_subaccounts():

    response = requests.get(
        "https://api.asaas.com/v3/accounts",
        headers={
            "access_token": ASAAS_API_KEY
        }
    )

    return response.json()



@router.post("/create-subaccount")
def create_subaccount(

    name: str = Body(...),
    email: str = Body(...),
    cpf_cnpj: str = Body(...),

    birth_date: str = Body(...),

    company_type: str = Body(...),

    income_value: float = Body(...),

    phone: str = Body(...),

    mobile_phone: str = Body(...),

    postal_code: str = Body(...),

    address: str = Body(...),

    address_number: str = Body(...),

    complement: str = Body(""),

    province: str = Body(...)

):

    payload = {
        "name": name,
        "email": email,
        "cpfCnpj": cpf_cnpj,
        "birthDate": birth_date,
        "companyType": company_type,
        "incomeValue": income_value,
        "phone": phone,
        "mobilePhone": mobile_phone,
        "postalCode": postal_code,
        "address": address,
        "addressNumber": address_number,
        "complement": complement,
        "province": province,
    }

    print("===== PAYLOAD =====")
    print(payload)

    response = requests.post(
        "https://api.asaas.com/v3/accounts",
        headers={
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json"
        },
        json=payload
    )

    print("===== STATUS =====")
    print(response.status_code)

    print("===== RESPOSTA ASAAS =====")
    print(response.text)


    data = response.json()

    subaccount_api_key = data.get("apiKey")

    if subaccount_api_key:

        requests.post(

            "https://api.asaas.com/v3/webhooks",

            headers={
                "access_token": subaccount_api_key,
                "Content-Type": "application/json"
            },

            json={

                "name": "Webhook Somar",

                "url": "https://somar-backend.onrender.com/asaas/webhook",

                "enabled": True,

                "interrupted": False,

                "sendType": "SEQUENTIALLY",

                "email": email,

                "events": [
                    "PAYMENT_RECEIVED"
                ]

            }

        )

    return data

   






@router.post("/webhook")
async def asaas_webhook(request: Request):

    body = await request.json()

    print("====================================")
    print("WEBHOOK ASAAS RECEBIDO")
    print(body)
    print("====================================")

    return {
        "success": True
    }



@router.post("/generate-api-key/{account_id}")
def generate_api_key(account_id: str):

    response = requests.post(
        f"https://api.asaas.com/v3/accounts/{account_id}/accessTokens",
        headers={
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "name": "Sistema Somar"
        }
    )

    print("===== GERAR API KEY =====")
    print(response.status_code)
    print(response.text)

    return response.json()