// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACsiVKkyG7XzxFYA7Hl4Wvb_VRnkPDyKw",
  authDomain: "site-ecsem.firebaseapp.com",
  projectId: "site-ecsem",
  storageBucket: "site-ecsem.appspot.com", // corrigi para .appspot.com
  messagingSenderId: "58164696898",
  appId: "1:58164696898:web:95acf2dfa5863e57341adb"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);