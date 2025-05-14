// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArPRI6agVlyvq01PJr-Cw9L1owGDhsuRU",
  authDomain: "fruiteomm.firebaseapp.com",
  projectId: "fruiteomm",
  storageBucket: "fruiteomm.firebasestorage.app",
  messagingSenderId: "565642499786",
  appId: "1:565642499786:web:5c77254a9cb948e1f20633",
  measurementId: "G-6F054D67VT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const analytics = getAnalytics(app);
export { db };
