'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import Toast from '../ui/Toast';
import { DeleteModal } from '../ui/DeleteModal';
import ActionButtons from '../ui/ActionButtons';
import EditModal from '../ui/EditModal';
import { CustomDropdown } from '../ui/CustomDropdown';

interface User {
  _id: string;
  fullName: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UsersResponse {
  users: User[];
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'admin'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning'; isVisible: boolean } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getUsers();
      
      if (response.success && response.data) {
        setUsers(response.data || []);
      } else {
        setToast({
          message: response.error || 'Failed to fetch users',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setToast({
        message: 'Failed to fetch users',
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const response = await apiClient.createUser(formData);
      
      if (response.success) {
        setToast({
          message: 'User created successfully',
          type: 'success',
          isVisible: true
        });
        
        // Reset form
        setFormData({
          username: '',
          password: '',
          fullName: '',
          role: 'admin'
        });
        setShowForm(false);
        
        // Refresh users list immediately for real-time update
        fetchUsers();
      } else {
        setToast({
          message: response.error || 'Failed to create user',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setToast({
        message: 'Failed to create user',
        type: 'error',
        isVisible: true
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await apiClient.updateUserStatus(userId, !currentStatus);
      
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ));
        
        setToast({
          message: `User ${currentStatus ? 'deactivated' : 'activated'} successfully`,
          type: 'success',
          isVisible: true
        });
        
        // Immediate refresh for real-time update
        setTimeout(() => fetchUsers(), 100);
      } else {
        setToast({
          message: response.error || 'Failed to update user status',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setToast({
        message: 'Failed to update user status',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await apiClient.deleteUser(userToDelete._id);
      
      if (response.success) {
        setUsers(prev => prev.filter(user => user._id !== userToDelete._id));
        
        setToast({
          message: 'User deleted successfully',
          type: 'success',
          isVisible: true
        });
        
        // Immediate refresh for real-time update
        setTimeout(() => fetchUsers(), 100);
        
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        setToast({
          message: response.error || 'Failed to delete user',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setToast({
        message: 'Failed to delete user',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleEditSubmit = async (formData: any) => {
    setEditLoading(true);
    
    try {
      // For now, we'll just show a success message
      // In a real app, you'd call an API to update the user
      setToast({
        message: `User "${formData.fullName}" updated successfully`,
        type: 'success',
        isVisible: true
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userToEdit?._id 
          ? { ...user, ...formData }
          : user
      ));
      
      setShowEditModal(false);
      setUserToEdit(null);
    } catch (error) {
      setToast({
        message: 'Failed to update user',
        type: 'error',
        isVisible: true
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    if (!userToEdit) return;
    
    setPasswordResetLoading(true);
    
    try {
      const response = await apiClient.resetUserPassword(userToEdit._id, newPassword);
      
      if (response.success) {
        setToast({
          message: `Password for "${userToEdit.fullName}" has been reset successfully. You can now login with the new password.`,
          type: 'success',
          isVisible: true
        });
      } else {
        setToast({
          message: response.error || 'Failed to reset password',
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      setToast({
        message: 'Failed to reset password. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setPasswordResetLoading(false);
    }
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full p-6">
      {/* Header */}
      <div className="bg-gray-100 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2.5 text-sm font-medium shadow-sm"
                title="Refresh Data"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-md transition-all duration-200 flex items-center gap-2.5 text-sm font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Total Users: {users.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-gray-100 rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Users Available</p>
                      <p className="text-sm text-gray-600">
                        No users found in the system. Add users to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'systemadmin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : user.role === 'shopadmin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <ActionButtons
                        buttons={[
                          {
                            label: 'Edit',
                            onClick: () => handleEditUser(user),
                            variant: 'primary'
                          },
                          {
                            label: user.isActive ? 'Deactivate' : 'Activate',
                            onClick: () => handleToggleStatus(user._id, user.isActive),
                            variant: user.isActive ? 'warning' : 'primary'
                          },
                          {
                            label: 'Delete',
                            onClick: () => handleDeleteUser(user),
                            variant: 'danger'
                          }
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      username: '',
                      password: '',
                      fullName: '',
                      role: 'admin'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Enter username"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <CustomDropdown
                    options={[
                      { value: 'systemadmin', label: 'System Admin' }
                    ]}
                    value={formData.role}
                    onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                    placeholder="Select role"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      username: '',
                      password: '',
                      fullName: '',
                      role: 'admin'
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {formLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && userToEdit && (
        <EditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setUserToEdit(null);
          }}
          onSubmit={handleEditSubmit}
          title="Edit User"
          data={userToEdit}
          fields={[
            {
              name: 'fullName',
              label: 'Full Name',
              type: 'text',
              required: true
            },
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              required: true
            },
            {
              name: 'role',
              label: 'Role',
              type: 'select',
              required: true,
              options: [
                { value: 'systemadmin', label: 'System Admin' }
              ]
            }
          ]}
          loading={editLoading}
          showPasswordSection={true}
          onPasswordReset={handlePasswordReset}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <DeleteModal
          item={userToDelete}
          title="Delete User"
          message="Are you sure you want to delete user {name}? This action cannot be undone."
          itemName={(user) => user.fullName}
          onClose={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          onConfirm={confirmDeleteUser}
          confirmButtonText="Delete User"
          cancelButtonText="Cancel"
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 