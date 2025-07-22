import React, { useState } from "react";
import { changePassword } from "../../services/authService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const { token } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(form.oldPassword, form.newPassword, token);
      toast.success("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="max-w-md bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          className="w-full border px-4 py-2"
          value={form.oldPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="w-full border px-4 py-2"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
