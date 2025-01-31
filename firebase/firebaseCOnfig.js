// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTG9bVaYdeNJTSrEbK2FrRtiFsWdPjz-w",
    authDomain: "phoenixcoin-19b13.firebaseapp.com",
    projectId: "phoenixcoin-19b13",
    storageBucket: "phoenixcoin-19b13.firebasestorage.app",
    messagingSenderId: "496208633082",
    appId: "1:496208633082:web:38eac9043bc58b1ccbbd43",
    measurementId: "G-G8R9MJFEXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { database, firestore, app, analytics };