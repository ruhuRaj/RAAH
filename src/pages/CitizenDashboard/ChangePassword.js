import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../services/authService";
import { useSelector } from "react-redux";
import { FiLock } from "react-icons/fi";

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const { token } = useSelector((state) => state.auth);

  const handleChange = async (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      return toast.error("Passwords do not match");
    }

    try {
      await changePassword(current, newPass, token);
      toast.success("Password updated successfully!");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <form
        onSubmit={handleChange}
        className="space-y-6 bg-white shadow-2xl rounded-xl p-8 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <FiLock size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-700">Change Password</h2>
        </div>

        <Input
          type="password"
          placeholder="🔑 Current Password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <Input
          type="password"
          placeholder="🆕 New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <Input
          type="password"
          placeholder="✅ Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          🔄 Update Password
        </button>
      </form>
    </div>
  );
};

const Input = ({ type, placeholder, value, onChange }) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default ChangePassword;
