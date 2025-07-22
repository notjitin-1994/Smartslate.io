import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export const authService = {
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signUpWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signInWithMicrosoft(): Promise<AuthResult> {
    try {
      const provider = new OAuthProvider('microsoft.com');
      const result = await signInWithPopup(auth, provider);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  }
};
