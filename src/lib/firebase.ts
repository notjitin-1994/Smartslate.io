import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// IMPORTANT: Storing API keys directly in your source code is a security risk.
// Consider using environment variables to protect your credentials.
// For example, in Vite, you can use `.env` files and `import.meta.env.VITE_API_KEY`.
const firebaseConfig = {
  apiKey: "AIzaSyDeN3mSpmnjyk9jIg6efqp8uQnb0_tpyiw",
  authDomain: "smartslate.io",
  projectId: "smartslatesite-app",
  storageBucket: "smartslatesite-app.appspot.com",
  messagingSenderId: "490151080321",
  appId: "1:490151080321:web:15778d0b8f45b8ef20f880"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Connect to auth emulator for development
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch (error) {
    console.warn('Failed to connect to emulators:', error);
  }
}

