import { apiConnector } from './apiConnector';
import { AUTH_ENDPOINTS, PROFILE_ENDPOINTS } from './apis';
import { setUser } from '../store/slices/profileSlice';
import {store} from '../index';
import { getUserDetails } from './operations/profileAPI';
const { LOGIN_API, REGISTER_STAFF_API, REGISTER_USER_API, SEND_OTP_API, VERIFY_OTP_API, CHANGE_PASSWORD_API, DELETE_ACCOUNT_API } = AUTH_ENDPOINTS;

export const login = async (credentials) => {
  try {
    const response = await apiConnector("POST", LOGIN_API, credentials);
    localStorage.setItem("token", JSON.stringify(response.token));
    
    // Dispatch fetch user profile
    store.dispatch(getUserDetails(response.token));
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (formData) => {
  try {
    console.log("Register API URL:", REGISTER_USER_API); 
    const response = await apiConnector('POST', REGISTER_USER_API, formData);
    console.log("REGISTER API RESPONSE (from backend):", response); // Log the full response

    // CHANGE: If response contains _id and email, it's considered successful.
    // Directly return the raw response from the backend.
    if (response._id && response.email) {
        return response; // Return the full response object received from the backend
    }
    
    // If the response doesn't have the expected success properties, throw an error.
    // This line will only be hit if the backend sends a 2xx response WITHOUT _id/email.
    throw new Error(response.message || "Registration failed. Unexpected response format from server.");
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Function to send OTP
export const sendOtp = async (email) => {
    try {
        const response = await apiConnector('POST', SEND_OTP_API, { email });
        console.log("SEND OTP API RESPONSE:", response);
        if (response.success) {
            return response;
        }
        throw new Error(response.message || "Failed to send OTP. Unexpected response.");
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

// Function to verify OTP
export const verifyOtp = async (email, otp) => {
    try {
        const response = await apiConnector('POST', VERIFY_OTP_API, { email, otp });
        console.log("VERIFY OTP API RESPONSE:", response);
        if (response.success) {
            return response;
        }
        throw new Error(response.message || "Failed to verify OTP. Invalid or expired OTP.");
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};

export const changePassword = async (oldPassword, newPassword, token) => {
  try {
    const response = await apiConnector('PUT', CHANGE_PASSWORD_API, {
      oldPassword,
      newPassword,
    }, token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (password, token) => {
  try {
    const response = await apiConnector('DELETE', DELETE_ACCOUNT_API, {
      password,
    }, token);
    return response;
  } catch (error) {
    throw error;
  }
};