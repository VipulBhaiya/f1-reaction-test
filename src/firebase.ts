// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // ✅ Realtime DB!

const firebaseConfig = {
    apiKey: "AIzaSyDWCNhezyAypwCEcD5l3QMYI1HmAIoHA7I",
    authDomain: "f1reactiontest.firebaseapp.com",
    databaseURL: "https://f1reactiontest-default-rtdb.firebaseio.com/",
    projectId: "f1reactiontest",
    storageBucket: "f1reactiontest.firebasestorage.app",
    messagingSenderId: "318187964836",
    appId: "1:318187964836:web:977d40f1d3a9e417d75931"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); // ✅ This gives you a Realtime Database reference
