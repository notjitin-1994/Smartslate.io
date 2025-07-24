import { auth, functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { User } from '../types/user';

// Import mock service for development
import * as mockService from './mockRoleService';

// --- Interfaces ---
export interface CreateUserData {
  email: string;
  displayName: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
}

export interface SetUserRoleData {
  email: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
}

// --- API Helper ---

const callApi = async <T>(functionName: string, data: object = {}): Promise<T> => {
    try {
        // Ensure user is authenticated
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No authenticated user found. Please log in again.');
        }

        // Force token refresh to ensure we have a valid token
        await user.getIdToken(true);
        
        const callable = httpsCallable(functions, functionName);
        const result = await callable(data);
        return result.data as T;
    } catch (error: any) {
        console.error(`Error calling ${functionName}:`, error);
        
        // Handle specific Firebase errors
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Authentication required. Please log in and try again.');
        } else if (error.code === 'functions/permission-denied') {
            throw new Error('You do not have permission to perform this action.');
        } else if (error.code === 'functions/unavailable') {
            throw new Error('Service temporarily unavailable. Please try again later.');
        }
        
        throw new Error(error.message || 'An unexpected error occurred.');
    }
};

// --- Service Functions ---

// Check if we should use mock service (development mode with Firebase issues)
const USE_MOCK_SERVICE = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_FIREBASE === 'true';

export const createUser = async (data: CreateUserData): Promise<{ uid: string }> => {
    if (USE_MOCK_SERVICE) {
        return mockService.createUser(data);
    }
    return callApi<{ uid: string }>('createUser', data);
};

export const assignRoleToUser = async (data: SetUserRoleData): Promise<{ status: string }> => {
    if (USE_MOCK_SERVICE) {
        return mockService.assignRoleToUser(data);
    }
    return callApi<{ status: string }>('setUserRole', data);
};

export const getUsers = async (): Promise<User[]> => {
    if (USE_MOCK_SERVICE) {
        return mockService.getUsers();
    }
    const result = await callApi<{ users: User[] }>('listUsers');
    return result.users;
};

export const updateUser = async (uid: string, data: { role: string }): Promise<{ uid: string; customClaims: any }> => {
    if (USE_MOCK_SERVICE) {
        return mockService.updateUser(uid, data);
    }
    return callApi<{ uid: string; customClaims: any }>('updateUser', { uid, ...data });
};

export const deleteUser = async (uid: string): Promise<{ status: string }> => {
    if (USE_MOCK_SERVICE) {
        return mockService.deleteUser(uid);
    }
    return callApi<{ status: string }>('deleteUser', { uid });
};

// Example of how to use this function in a React component:
/*

import { useState } from 'react';
import { assignRoleToUser } from './services/roleService';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('learner');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAssignRole = async () => {
    setMessage('');
    setError('');
    try {
      const result = await assignRoleToUser({ email, role });
      setMessage(result.message);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Assign User Role</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="User's email"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="learner">Learner</option>
        <option value="manager">Manager</option>
        <option value="smartslate-manager">Smartslate Manager</option>
        <option value="smartslate-admin">Smartslate Admin</option>
      </select>
      <button onClick={handleAssignRole}>Assign Role</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

*/
