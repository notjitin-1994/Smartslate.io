import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

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
export const db = getFirestore(app);

// User data collection reference
const usersCollection = collection(db, 'users');

// User data type
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  // Add additional user fields as needed
  [key: string]: any;
}

/**
 * Creates or updates a user document in Firestore
 * @param user Firebase User object
 * @param additionalData Additional user data to store
 */
export const createOrUpdateUserProfile = async (
  user: FirebaseUser,
  additionalData: Partial<UserProfile> = {}
): Promise<void> => {
  if (!user.uid) throw new Error('User UID is required');

  const userRef = doc(usersCollection, user.uid);
  const userData: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || additionalData.displayName || '',
    photoURL: user.photoURL || additionalData.photoURL || '',
    updatedAt: serverTimestamp(),
    ...additionalData,
  };

  // Only set createdAt for new users
  if (!additionalData.createdAt) {
    userData.createdAt = serverTimestamp();
  }

  await setDoc(userRef, userData, { merge: true });
};

/**
 * Fetches a user's profile from Firestore
 * @param uid User ID
 * @returns User profile or null if not found
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) throw new Error('User ID is required');
  
  const userRef = doc(usersCollection, uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return userSnap.data() as UserProfile;
};

/**
 * Updates a user's profile in Firestore
 * @param uid User ID
 * @param data Partial user data to update
 */
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  if (!uid) throw new Error('User ID is required');
  
  const userRef = doc(usersCollection, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a user's profile from Firestore
 * @param uid User ID
 */
export const deleteUserProfile = async (uid: string): Promise<void> => {
  if (!uid) throw new Error('User ID is required');
  
  const userRef = doc(usersCollection, uid);
  await deleteDoc(userRef);
};
