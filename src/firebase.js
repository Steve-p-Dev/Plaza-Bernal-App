// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-hISp4u834ki8J_UCSB5_5ueUeFjXl8w",
  authDomain: "plazabernal-10871.firebaseapp.com",
  projectId: "plazabernal-10871",
  storageBucket: "plazabernal-10871.firebasestorage.app",
  messagingSenderId: "191427868652",
  appId: "1:191427868652:web:04802a392d36de57e9f2c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
