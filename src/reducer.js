import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './store/slices/authSlice';
import profileReducer from './store/slices/profileSlice';
import grievanceReducer from "./store/slices/grievanceSlice";
// import other reducers here as you can create them

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    grievance: grievanceReducer,
    // add other reducers here
});

export default rootReducer;