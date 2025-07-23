import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

// Define the type for the data sent to the function
interface SetUserRoleData {
  email: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
}

// Define the expected success response from the function
interface SetUserRoleResponse {
  status: string;
  message: string;
}

/**
 * Calls the 'setUserRole' Cloud Function to assign a role to a user.
 * This can only be successfully executed by a logged-in 'smartslate-admin'.
 *
 * @param data - An object containing the email of the target user and the role to assign.
 * @returns A promise that resolves with the success message.
 * @throws Will throw an error if the function call fails, which can be caught
 *         to display a user-friendly error message.
 */
export const assignRoleToUser = async (data: SetUserRoleData): Promise<SetUserRoleResponse> => {
  try {
    const setUserRole = httpsCallable<SetUserRoleData, SetUserRoleResponse>(functions, 'setUserRole');
    const result = await setUserRole(data);
    return result.data;
  } catch (error: any) {
    console.error('Error calling setUserRole function:', error);
    // The error object from Firebase Functions contains a 'message' property
    // with a user-friendly error string.
    throw new Error(error.message || 'An unexpected error occurred while assigning the role.');
  }
};

export const getUsers = async (): Promise<any[]> => {
  try {
    const listUsers = httpsCallable(functions, 'listUsers');
    const result = await listUsers();
    return (result.data as any).users;
  } catch (error: any) {
    console.error('Error calling listUsers function:', error);
    throw new Error(error.message || 'An unexpected error occurred while fetching users.');
  }
};

export const updateUser = async (uid: string, data: any): Promise<any> => {
  try {
    const updateUserFunction = httpsCallable(functions, 'updateUser');
    const result = await updateUserFunction({ uid, ...data });
    return result.data;
  } catch (error: any) {
    console.error('Error calling updateUser function:', error);
    throw new Error(error.message || 'An unexpected error occurred while updating the user.');
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const deleteUserFunction = httpsCallable(functions, 'deleteUser');
    await deleteUserFunction({ uid });
  } catch (error: any) {
    console.error('Error calling deleteUser function:', error);
    throw new Error(error.message || 'An unexpected error occurred while deleting the user.');
  }
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
