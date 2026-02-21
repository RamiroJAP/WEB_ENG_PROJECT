// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0e0KeHL76ZQIzJaXvPjCiq59pm199P-g",
  authDomain: "web-eng-project-d657d.firebaseapp.com",
  projectId: "web-eng-project-d657d",
  storageBucket: "web-eng-project-d657d.firebasestorage.app",
  messagingSenderId: "836248577249",
  appId: "1:836248577249:web:ad8838086fad5f522383a0",
  measurementId: "G-EW8Q851N99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
