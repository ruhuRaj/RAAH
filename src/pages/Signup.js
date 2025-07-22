import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputField from '../components/Common/InputField';
import Button from '../components/Common/Button';
import Loader from '../components/Common/Loader';
import { sendOtp } from '../services/authService'; // Only need sendOtp here now
import { ACCOUNT_TYPE } from '../utils/constants';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setSignupData } from '../store/slices/authSlice'; // Import setSignupData

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic validation for all required fields before sending OTP
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.accountType) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        setLoading(false);
        return;
      }
      if (formData.accountType !== ACCOUNT_TYPE.CITIZEN && !formData.department) {
        toast.error("Department ID is required for selected account type.");
        setLoading(false);
        return;
      }

      // Prepare data to send OTP
      const emailToSendOtp = formData.email;
      
      const response = await sendOtp(emailToSendOtp);
      console.log("Response from sendOtp API call:", response); 

      if (response.success) {
        toast.success("OTP sent to your email!");
        // Store formData in Redux before navigating
        dispatch(setSignupData(formData)); 
        navigate("/verify-email"); // Navigate to the new OTP verification page
      } else {
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-gray-100 p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Sign Up</h1>
        <form onSubmit={handleSendOtp}> {/* Always submit to handleSendOtp */}
          <InputField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
          <InputField
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />

          <div className="mb-4">
            <label htmlFor="accountType" className="block text-gray-700 text-sm font-bold mb-2">
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
              required
            >
              <option value="" disabled>Select Account Type</option>
              {Object.keys(ACCOUNT_TYPE).map((key) => (
                <option key={key} value={ACCOUNT_TYPE[key]}>
                  {ACCOUNT_TYPE[key]}
                </option>
              ))}
            </select>
          </div>

          {formData.accountType !== ACCOUNT_TYPE.CITIZEN && formData.accountType !== '' && (
            <InputField
              label="Department ID (for Officers/DM)"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department ID (if applicable)"
              required={formData.accountType !== ACCOUNT_TYPE.CITIZEN}
            />
          )}

          <div className="mt-4 sm:mt-6">
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? <Loader size="sm" className="inline-block mr-2" /> : "Sign Up"}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;