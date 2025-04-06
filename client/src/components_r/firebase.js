// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyArPRI6agVlyvq01PJr-Cw9L1owGDhsuRU",
  // authDomain: "fruiteomm.firebaseapp.com",
  // projectId: "fruiteomm",
  // storageBucket: "fruiteomm.firebasestorage.app",
  // messagingSenderId: "565642499786",
  // appId: "1:565642499786:web:5c77254a9cb948e1f20633",
  // measurementId: "G-6F054D67VT",
  apiKey: "AIzaSyD036u3n8XVI1391XD8f2Jbw0uO5uMvqHU",
  authDomain: "restaurantapp-7a62a.firebaseapp.com",
  projectId: "restaurantapp-7a62a",
  storageBucket: "restaurantapp-7a62a.firebasestorage.app",
  messagingSenderId: "318453287103",
  appId: "1:318453287103:web:04d684e4981a1cac735e0a",
  measurementId: "G-5WP8MQWBWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const analytics = getAnalytics(app);
export { db };
