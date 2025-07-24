import { Timestamp } from 'firebase/firestore';

/**
 * Represents a user in the system.
 * This interface is used across the frontend to ensure type safety.
 */
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  customClaims?: {
    role: 'learner' | 'manager' | 'smartslate-manager' | 'smartslate-admin';
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Defines the props for the UserProfile component.
 */
export interface UserProfileProps {
  userId: string;
}

/**
 * Represents the data required to update a user.
 * All fields are optional, allowing for partial updates.
 */
export type UpdateUserData = Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>;
