from fastapi import APIRouter

import requests

from fastapi import Body

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
    cpf_cnpj: str = Body(...)
):

    response = requests.post(
        "https://api.asaas.com/v3/accounts",
        headers={
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "name": name,
            "email": email,
            "cpfCnpj": cpf_cnpj
        }
    )

    return response.json()


@router.post("/create-test-subaccount")
def create_test_subaccount():

    response = requests.post(
        "https://api.asaas.com/v3/accounts",
        headers={
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json"
        },
        json={
            "name": "Teste Campanha",
            "email": "teste-campanha@exemplo.com",
            "cpfCnpj": "66625514000140",
            "birthDate": "1994-05-16",
            "companyType": "MEI",
            "incomeValue": 5000,
            "phone": "1132300606",
            "mobilePhone": "11991112233",
            "address": "Rua Teste",
            "addressNumber": "123",
            "province": "Centro",
            "postalCode": "89223005"
        }
    )

    return response.json()