// inicializando o firebase

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// importanto a autenticação senha/email
import { getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1-xFihfaKH22sxnbaWUd_hTo00mWngSs",
    authDomain: "fir-e0b98.firebaseapp.com",
    projectId: "fir-e0b98",
    storageBucket: "fir-e0b98.appspot.com",
    messagingSenderId: "1062301134533",
    appId: "1:1062301134533:web:11dfcf875d67016f670aac",
    measurementId: "G-Z157899C02"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };