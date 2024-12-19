// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALosiQqpqzUrA8-ZbzS4uMTjmA1gsatck",
  authDomain: "project-management-webap.firebaseapp.com",
  projectId: "project-management-webap",
  storageBucket: "project-management-webap.firebasestorage.app",
  messagingSenderId: "73035087188",
  appId: "1:73035087188:web:348367866305176b4ddcc1",
  measurementId: "G-F612FGL4G1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
