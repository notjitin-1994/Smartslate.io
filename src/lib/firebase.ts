import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBs1ldp7dCCg67PwF4sCUfcwy8Lne2P9uo",
  authDomain: "smartslatesite-app.firebaseapp.com",
  projectId: "smartslatesite-app",
  storageBucket: "smartslatesite-app.appspot.com",
  messagingSenderId: "490151080321",
  appId: "1:490151080321:web:a1b2c3d4e5f6g7h8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
