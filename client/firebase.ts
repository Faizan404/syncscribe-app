// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMgTgT7hJLYu27lT75if_PDLfI8emRZQA",
  authDomain: "ai-notion-clone-7e01d.firebaseapp.com",
  projectId: "ai-notion-clone-7e01d",
  storageBucket: "ai-notion-clone-7e01d.firebasestorage.app",
  messagingSenderId: "140486724806",
  appId: "1:140486724806:web:172c06ddd16c0b683b9bc7",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };
