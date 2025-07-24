import { useState, useEffect, useMemo, useCallback } from 'react';
import { createUser, getUsers, deleteUser, updateUser, CreateUserData } from '../services/roleService';
import { User } from '../types/user';
import { Toaster, toast } from 'sonner';

// Custom hook for managing users
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch users.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = (newUser: User) => {
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const updateUserInState = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(user => user.uid === updatedUser.uid ? updatedUser : user));
  };

  const removeUser = (uid: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.uid !== uid));
  };

  return { users, loading, error, fetchUsers, addUser, updateUserInState, removeUser };
};

// Component for a single user row
const UserRow = ({ user, onEdit, onDelete }: { user: User; onEdit: (user: User) => void; onDelete: (uid: string) => void }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-100">
    <td className="py-3 px-6 text-left whitespace-nowrap">{user.displayName || 'N/A'}</td>
    <td className="py-3 px-6 text-left">{user.email}</td>
    <td className="py-3 px-6 text-center">{user.customClaims?.role || 'learner'}</td>
    <td className="py-3 px-6 text-center">
      <button onClick={() => onEdit(user)} className="text-blue-500 hover:underline mr-4">Edit</button>
      <button onClick={() => onDelete(user.uid)} className="text-red-500 hover:underline">Delete</button>
    </td>
  </tr>
);

// Modal for adding/editing a user
const UserModal = ({ user, onClose, onSave }: { user: User | null; onClose: () => void; onSave: (userData: any, isNew: boolean) => Promise<void> }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.customClaims?.role || 'learner');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const userData = user ? { uid: user.uid, role } : { email, password, displayName, role };
    await onSave(userData, !user);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{user ? 'Edit User' : 'Add New User'}</h2>
        {!user && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Display Name</label>
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        <div className="mb-6">
          <label className="block text-gray-700">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full p-2 border rounded">
            <option value="learner">Learner</option>
            <option value="manager">Manager</option>
            <option value="smartslate-manager">Smartslate Manager</option>
            <option value="smartslate-admin">Smartslate Admin</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-4 p-2" disabled={isSaving}>Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { users, loading, error, addUser, updateUserInState, removeUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [users, searchTerm]);

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (userData: any, isNew: boolean) => {
    try {
      if (isNew) {
        const { user: newUser } = await createUser(userData as CreateUserData);
        addUser(newUser);
        toast.success('User created successfully!');
      } else {
        const updatedUser = await updateUser(userData.uid, { role: userData.role });
        updateUserInState(updatedUser);
        toast.success('User updated successfully!');
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(uid);
        removeUser(uid);
        toast.success('User deleted successfully.');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <button onClick={() => openModal()} className="bg-green-500 text-white p-2 rounded">Add User</button>
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/4 py-3 px-6 text-left">Name</th>
                <th className="w-1/4 py-3 px-6 text-left">Email</th>
                <th className="w-1/4 py-3 px-6 text-center">Role</th>
                <th className="w-1/4 py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.map(user => (
                <UserRow 
                  key={user.uid} 
                  user={user} 
                  onEdit={openModal} 
                  onDelete={handleDeleteUser} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && <UserModal user={editingUser} onClose={closeModal} onSave={handleSaveUser} />}
    </div>
  );
};

export default AdminDashboard;
