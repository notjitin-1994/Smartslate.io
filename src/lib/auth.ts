import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface AuthResult {
  success: boolean;
  error?: string;
  confirmationResult?: ConfirmationResult;
}

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    await signInWithPopup(auth, googleProvider);
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
};

export const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<AuthResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, confirmationResult };
  } catch (error) {
    const authError = error as AuthError;
    return { 
      success: false, 
      error: getAuthErrorMessage(authError.code) 
    };
  }
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/missing-phone-number':
      return 'Please enter a phone number.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};
