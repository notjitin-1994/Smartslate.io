import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/userService';
import { User, UserProfileProps, UpdateUserData } from '../../types';

/**
 * A component to display and manage a user's profile.
 * It demonstrates fetching, updating, and deleting user data using the userService.
 */
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateUserData>({});

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getUser(userId);
      setUser(userData);
      setFormData({
        displayName: userData.displayName || '',
        role: userData.role || 'learner',
      });
    } catch (err) {
      setError('Failed to fetch user data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await userService.updateUser(user.uid, formData);
      // Refresh user data after update
      await fetchUser();
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update user.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(user.uid);
      setUser(null); // Clear user data on successful deletion
      alert('User deleted successfully.');
    } catch (err) {
      setError('Failed to delete user.');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center p-4">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.photoURL || 'https://via.placeholder.com/150'}
          alt={user.displayName || 'User'}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-gray-600">{user.email}</p>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end space-x-2">
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Edit Profile
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">
            Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
