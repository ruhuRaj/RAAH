import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteAccount } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword, token);
      toast.success('Account deleted successfully');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="text-gray-900">{user?.accountType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/change-password')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-800">Delete Account</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action will permanently delete your account and all associated data. 
              This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;