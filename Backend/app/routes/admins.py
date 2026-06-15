from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from firebase_admin import auth, firestore

from app.config.firebase import db

router = APIRouter()

class CreateAdminRequest(BaseModel):
    name: str
    cpf: str
    email: str
    phone: str
    password: str
    role: str = "admin"


@router.post("/create-admin")
async def create_admin(
    data: CreateAdminRequest
):

    try:

        existing_user = auth.get_user_by_email(
            data.email
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="E-mail já cadastrado."
            )

    except auth.UserNotFoundError:

        pass

    try:

        user = auth.create_user(
            email=data.email,
            password=data.password,
            display_name=data.name
        )

        db.collection("users").document(
            user.uid
        ).set({

            "name": data.name,

            "cpf": data.cpf,

            "email": data.email,

            "phone": data.phone,

            "role": "admin",

            "createdAt":
                firestore.SERVER_TIMESTAMP

        })

        return {

            "success": True,

            "message":
                "Administrador criado com sucesso.",

            "uid":
                user.uid

        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )