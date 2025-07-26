import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserListComponent } from '../components/admin/UserListComponent';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.email !== 'jitin@smartslate.io') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users and system settings</p>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>
          <div className="p-6">
            <UserListComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
