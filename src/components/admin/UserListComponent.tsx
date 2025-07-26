import React, { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  emailVerified: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime?: string;
  };
  providerData: any[];
  customClaims?: Record<string, any>;
}

interface ListUsersResponse {
  users: FirebaseUser[];
  nextPageToken?: string;
}

export const UserListComponent: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const listAllUsers = httpsCallable<{ nextPageToken?: string }, ListUsersResponse>(
    functions,
    'listAllUsers'
  );

  const loadUsers = async (pageToken?: string, append = false) => {
    if (!user) {
      setError('You must be logged in to view users');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await listAllUsers({ nextPageToken: pageToken });
      const data = result.data;

      if (append) {
        setUsers(prevUsers => [...prevUsers, ...data.users]);
      } else {
        setUsers(data.users);
      }

      setNextPageToken(data.nextPageToken);
      setHasMoreUsers(!!data.nextPageToken);
    } catch (err: any) {
      console.error('Error loading users:', err);
      
      if (err.code === 'functions/unauthenticated') {
        setError('You must be authenticated to access this function');
      } else if (err.code === 'functions/permission-denied') {
        setError('You do not have permission to access this function');
      } else {
        setError(`Error loading users: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    if (nextPageToken && !loading) {
      loadUsers(nextPageToken, true);
    }
  };

  const refreshUsers = () => {
    setUsers([]);
    setNextPageToken(undefined);
    setHasMoreUsers(true);
    loadUsers();
  };

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Please log in to view users</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Firebase Users</h2>
        <button
          onClick={refreshUsers}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {users.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sign In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || 'No display name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.uid}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                      {user.emailVerified && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.disabled 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.metadata.creationTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.metadata.lastSignInTime 
                        ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMoreUsers && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <button
                onClick={loadMoreUsers}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Load More Users'}
              </button>
            </div>
          )}
        </div>
      )}

      {users.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      {loading && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}
    </div>
  );
};
