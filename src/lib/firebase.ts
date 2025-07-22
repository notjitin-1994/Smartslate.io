import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDeN3mSpmnjyk9jIg6efqp8uQnb0_tpyiw",
  authDomain: "smartslatesite-app.firebaseapp.com",
  projectId: "smartslatesite-app",
  storageBucket: "smartslatesite-app.appspot.com",
  messagingSenderId: "490151080321",
  appId: "1:490151080321:web:15778d0b8f45b8ef20f880"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
