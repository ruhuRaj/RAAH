import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputField from '../components/Common/InputField';
import Button from '../components/Common/Button';
import Loader from '../components/Common/Loader';
import { login as loginUserService } from '../services/authService';
import { setToken } from '../store/slices/authSlice';
import { setUser } from '../store/slices/profileSlice';
import { useDispatch } from 'react-redux';
import { fetchGrievances as fetchGrievancesService } from '../services/grievanceService';
import { setAllGrievances } from '../store/slices/grievanceSlice';
import { ACCOUNT_TYPE } from '../utils/constants'; // Import ACCOUNT_TYPE

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    accountType: ACCOUNT_TYPE.CITIZEN // Default to Citizen
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Log the formData before sending to verify its content
      console.log("Login form data being sent:", formData); 
      const response = await loginUserService(formData); // Send formData which now includes accountType
      dispatch(setToken(response.token));
      dispatch(setUser({
        _id: response._id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        accountType: response.accountType,
      }));
      toast.success(`Welcome, ${response.firstName || response.email}!`);
      
      const allData = await fetchGrievancesService(response.token);
      dispatch(setAllGrievances(allData.grievances));

      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-gray-100 p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            required
          />

          {/* Account Type Selection */}
          <div className="mb-4">
            <label htmlFor="accountType" className="block text-gray-700 text-sm font-bold mb-2">
              Login As
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
              required
            >
              {/* Use Object.keys to get the keys (e.g., 'CITIZEN') and then map to values */}
              {Object.keys(ACCOUNT_TYPE).map((key) => (
                <option key={key} value={ACCOUNT_TYPE[key]}>
                  {ACCOUNT_TYPE[key]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-y-2">
            <Button type="submit" variant="primary" disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader size="sm" className="inline-block mr-2" /> : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/forgot-password")} className="w-full sm:w-auto">
              Forgot Password?
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;