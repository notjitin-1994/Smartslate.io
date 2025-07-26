import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInAnonymously } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle sign out
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will handle the user state update
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw to allow handling in the component
    }
  }, []);


  // Handle auth state changes
  useEffect(() => {


    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.isAnonymous) {
          // If user is anonymous, treat them as logged out on the frontend
          setUser(null);
        } else {
          // If user is a real user, set them as logged in
          setUser(user);
        }
      } else {
        // If no user, sign in anonymously for tracking
        signInAnonymously().catch((error) => {
          console.error('Error signing in anonymously:', error);
        });
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
