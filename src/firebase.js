import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDzPs68nvy4J-ThEJoPBNkvyOk-yigeUwQ",
    authDomain: "pickle-ball-score.firebaseapp.com",
    projectId: "pickle-ball-score",
    storageBucket: "pickle-ball-score.appspot.com",
    messagingSenderId: "286965347036",
    appId: "1:286965347036:web:497afc62450dfd1900ba19",
    measurementId: "G-ZHENY9ESFF"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);