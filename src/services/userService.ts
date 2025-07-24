import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { User, UpdateUserData } from '../types';

/**
 * A service object for interacting with user-related Firebase Cloud Functions.
 * It provides a clean, type-safe API for frontend components.
 */
export const userService = {
  /**
   * Fetches a user's data from the backend.
   *
   * @param userId - The unique identifier of the user to fetch.
   * @returns A promise that resolves to the user object.
   * @throws Throws an error if the cloud function call fails.
   */
  async getUser(userId: string): Promise<User> {
    try {
      const getUserFunction = httpsCallable(functions, 'getUser');
      const result = await getUserFunction({ userId });
      return result.data as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user data.');
    }
  },

  /**
   * Updates a user's information.
   *
   * @param userId - The unique identifier of the user to update.
   * @param userData - An object containing the user data to update.
   * @returns A promise that resolves when the update is complete.
   * @throws Throws an error if the update fails.
   */
  async updateUser(userId: string, userData: UpdateUserData): Promise<void> {
    try {
      const updateUserFunction = httpsCallable(functions, 'updateUser');
      await updateUserFunction({ userId, userData });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user.');
    }
  },

  /**
   * Deletes a user from the system.
   *
   * @param userId - The unique identifier of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   * @throws Throws an error if the deletion fails.
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      await deleteUserFunction({ userId });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  },

  /**
   * Lists all users in the system. (Admin only)
   *
   * @returns A promise that resolves to an array of user objects.
   * @throws Throws an error if the cloud function call fails.
   */
  async listUsers(): Promise<User[]> {
    try {
      const listUsersFunction = httpsCallable(functions, 'listUsers');
      const result = await listUsersFunction();
      return result.data as User[];
    } catch (error) {
      console.error('Error listing users:', error);
      throw new Error('Failed to list users.');
    }
  },
};
