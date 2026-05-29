import { initializeApp }
  from "firebase/app";

import { getAuth }
  from "firebase/auth";

import { getFirestore }
  from "firebase/firestore";

import { getStorage }
  from "firebase/storage";

const firebaseConfig = {
  apiKey:
    "AIzaSyALVuNBMNz1V7gW0ZhJkXMIjuVZtVYSqFo",

  authDomain:
    "somar-database.firebaseapp.com",

  projectId:
    "somar-database",

  storageBucket:
    "somar-database.firebasestorage.app",

  messagingSenderId:
    "710780167357",

  appId:
    "1:710780167357:web:3ffe4ae85da7ded61c03d4",

  measurementId:
    "G-ND7QZSBWYW",
};

export const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);