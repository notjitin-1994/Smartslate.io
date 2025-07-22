import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    switch (error.code) {
      case 'auth/user-not-found':
        setError('No account found with this email address.');
        break;
      case 'auth/wrong-password':
        setError('Incorrect password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        setError('An account with this email already exists.');
        break;
      case 'auth/weak-password':
        setError('Password should be at least 6 characters long.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later.');
        break;
      case 'auth/network-request-failed':
        setError('Network error. Please check your connection.');
        break;
      case 'auth/popup-closed-by-user':
        setError('Sign-in was cancelled. Please try again.');
        break;
      case 'auth/cancelled-popup-request':
        setError('Only one sign-in popup allowed at a time.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
    }
  };

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      try {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          role: 'student',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          },
          learningAnalytics: {
            totalTimeSpent: 0,
            coursesCompleted: 0,
            skillsAcquired: [],
            learningStreak: 0
          },
          courseProgress: {},
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    } else {
      try {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(result.user, {
        displayName: fullName
      });
      
      await createUserDocument(result.user, { displayName: fullName });
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      setError(null);
      setLoading(true);
      
      setError('Microsoft authentication will be available soon. Please use email or Google for now.');
      throw new Error('Microsoft auth not implemented yet');
    } catch (error) {
      if (error instanceof Error && error.message !== 'Microsoft auth not implemented yet') {
        handleAuthError(error as AuthError);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneVerification = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      setError(null);
      setLoading(true);
      
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          }
        });
      }
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        (window as any).recaptchaVerifier
      );
      
      return confirmationResult;
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
    try {
      setError(null);
      setLoading(true);
      const result = await confirmationResult.confirm(code);
      await createUserDocument(result.user);
    } catch (error) {
      handleAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await createUserDocument(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithMicrosoft,
    sendPhoneVerification,
    verifyPhoneCode,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
