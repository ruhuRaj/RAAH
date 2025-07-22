import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputField from '../components/Common/InputField';
import Button from '../components/Common/Button';
import Loader from '../components/Common/Loader';
import { register as registerUserService, sendOtp, verifyOtp } from '../services/authService';
import { clearSignupData } from '../store/slices/authSlice'; // Import clearSignupData

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData } = useSelector((state) => state.auth); // Get signup data from Redux
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if signupData is not present (user directly navigated here)
  useEffect(() => {
    if (!signupData) {
      navigate("/signup"); // Redirect back to signup if no data
    }
  }, [signupData, navigate]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otp) {
        toast.error("Please enter the OTP.");
        setLoading(false);
        return;
      }
      if (otp.length !== 6) { // Assuming 6-digit OTP
        toast.error("OTP must be 6 digits.");
        setLoading(false);
        return;
      }

      // Verify OTP
      const verifyResponse = await verifyOtp(signupData.email, otp);
      if (verifyResponse.success) {
        toast.success("OTP verified successfully!");
        
        // If OTP is verified, now call the actual registration service
        const registerResponse = await registerUserService(signupData);
        if (registerResponse._id) { // Check for _id or other success indicator from register
            toast.success(registerResponse.message || "Registration successful! Please log in.");
            dispatch(clearSignupData()); // Clear signup data from Redux
            navigate("/login"); // Navigate to login page
        } else {
            throw new Error(registerResponse.message || "Registration failed after OTP verification.");
        }
      } else {
        throw new Error(verifyResponse.message || "Invalid or expired OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Error during OTP verification or registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      if (!signupData || !signupData.email) {
        toast.error("No email found to resend OTP.");
        setLoading(false);
        return;
      }
      const response = await sendOtp(signupData.email);
      if (response.success) {
        toast.success("New OTP sent to your email!");
      } else {
        toast.error(response.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error(error.message || "Error resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return <Loader className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center" />; // Show loader while redirecting
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-gray-100 p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Verify Email</h1>
        <form onSubmit={handleVerifyOtpAndRegister}>
          <p className="text-center text-gray-700 mb-4">
            An OTP has been sent to <span className="font-semibold">{signupData.email}</span>. Please enter it below.
          </p>
          <InputField
            label="OTP"
            type="text"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            required
          />
          <div className="mt-4 sm:mt-6 flex flex-col gap-2">
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? <Loader size="sm" className="inline-block mr-2" /> : "Verify OTP"}
            </Button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:underline text-sm mt-2"
              disabled={loading}
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")} // Go back to signup page
              className="text-gray-600 hover:underline text-sm mt-2"
              disabled={loading}
            >
              &larr; Back to Signup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;