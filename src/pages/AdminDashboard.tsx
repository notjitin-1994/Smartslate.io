import { useState, useEffect, useMemo } from 'react';
import { assignRoleToUser, getUsers, deleteUser, updateUser } from '../services/roleService';

// Custom hook for managing users
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      await deleteUser(uid);
      setUsers(users.filter(user => user.uid !== uid));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (uid, data) => {
    try {
      const updatedUserData = await updateUser(uid, data);
      setUsers(users.map(user => user.uid === uid ? updatedUserData : user));
    } catch (err) {
      setError(err.message);
    }
  };

  return { users, loading, error, handleDeleteUser, handleUpdateUser };
};

// Component for a single user row
const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-100">
    <td className="py-3 px-6 text-left whitespace-nowrap">{user.displayName || 'N/A'}</td>
    <td className="py-3 px-6 text-left">{user.email}</td>
    <td className="py-3 px-6 text-center">{user.customClaims?.role || 'N/A'}</td>
    <td className="py-3 px-6 text-center">
      <button onClick={() => onEdit(user)} className="text-blue-500 hover:underline mr-4">Edit</button>
      <button onClick={() => onDelete(user.uid)} className="text-red-500 hover:underline">Delete</button>
    </td>
  </tr>
);

// Modal for adding/editing a user
const UserModal = ({ user, onClose, onSave }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.customClaims?.role || 'learner');

  const handleSave = () => {
    onSave(user?.uid, { email, role });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{user ? 'Edit User' : 'Add User'}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded"
            disabled={!!user} // Disable email editing for existing users
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
            <option value="learner">Learner</option>
            <option value="manager">Manager</option>
            <option value="smartslate-manager">Smartslate Manager</option>
            <option value="smartslate-admin">Smartslate Admin</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-4 p-2">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { users, loading, error, handleDeleteUser, handleUpdateUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [users, searchTerm]);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = async (uid, data) => {
    if (uid) {
      await handleUpdateUser(uid, data);
    } else {
      // Note: Adding a new user requires a different flow (e.g., sending an invite)
      // This is a placeholder for updating roles.
      const { email, role } = data;
      await assignRoleToUser({ email, role });
    }
    // Refetch users to see changes
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
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
