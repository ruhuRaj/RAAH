import { apiConnector } from "../apiConnector";
import { setUser } from "../../store/slices/profileSlice";
import { PROFILE_ENDPOINTS } from "../apis";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";

export const getUserDetails = (token) => {
  return async (dispatch) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await apiConnector(
        "GET",
        PROFILE_ENDPOINTS.GET_USER_PROFILE(userId),
        null,
        token
      );

      dispatch(setUser(response));
      localStorage.setItem("raahUser", JSON.stringify(response));
      localStorage.setItem("raahAccountType", response.accountType);
    } catch (error) {
      console.error("Error in fetching user details:", error);
    }
  };
};


export const updateProfile = async (userId, updatedData, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      PROFILE_ENDPOINTS.UPDATE_USER_PROFILE(userId),
      updatedData,
      token
    );
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};


export const uploadProfileImage = (userId, file, token) => {
  return async (dispatch, getState) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // must match backend multer key

      const response = await apiConnector(
        "POST",
        PROFILE_ENDPOINTS.UPLOAD_PROFILE_IMAGE(userId),
        formData,
        token,
        true // isMultipart
      );

      // Instead of replacing the whole user, merge with existing
      const prevUser = getState().profile.user;

      dispatch(setUser({
        ...prevUser,
        image: response.imageUrl,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(error.message || "Failed to upload image");
    }
  };
};