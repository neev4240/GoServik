import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSST9EHRk57-MERnU-i9A5a8anZtXgRqQ",
  authDomain: "goservik.firebaseapp.com",
  projectId: "goservik",
  storageBucket: "goservik.firebasestorage.app",
  messagingSenderId: "1083463283410",
  appId: "1:1083463283410:web:617c9627f772d94cc0330b"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
