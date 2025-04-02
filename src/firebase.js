// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcx2o30ylwVqO4Wv1GXSJ0TI0L7DPYuuA",
  authDomain: "setflow-363f5.firebaseapp.com",
  projectId: "setflow-363f5",
  storageBucket: "setflow-363f5.firebasestorage.app",
  messagingSenderId: "224296816178",
  appId: "1:224296816178:web:540c306b2b914e52aeb62b",
  measurementId: "G-2Z58EBF3QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);