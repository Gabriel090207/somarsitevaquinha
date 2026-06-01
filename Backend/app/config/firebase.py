import os
import json

import firebase_admin

from firebase_admin import credentials
from firebase_admin import firestore

if os.path.exists(
    "app/firebase/serviceAccountKey.json"
):

    cred = credentials.Certificate(
        "app/firebase/serviceAccountKey.json"
    )

else:

    firebase_credentials = json.loads(
        os.getenv(
            "FIREBASE_CREDENTIALS"
        )
    )

    cred = credentials.Certificate(
        firebase_credentials
    )

firebase_admin.initialize_app(
    cred
)

db = firestore.client()