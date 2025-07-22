import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../services/authService';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(formData.oldPassword, formData.newPassword, token);
      toast.success('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
