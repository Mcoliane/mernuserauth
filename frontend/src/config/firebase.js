// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDXrCK8Dq3B2VZugUOwb6IGOheIa_JV0Mg",
    authDomain: "chess-25eb7.firebaseapp.com",
    projectId: "chess-25eb7",
    storageBucket: "chess-25eb7.firebasestorage.app",
    messagingSenderId: "454970288451",
    appId: "1:454970288451:web:535208d8e831567260e7f6",
    measurementId: "G-H652V1N2J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();