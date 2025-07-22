import React from "react";
import { useEffect, useState, useCallback } from "react";
import {Form, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import "./App.css";

import { login, register } from "./services/authService";
import {fetchGrievances as fetchGrievancesService} from './services/grievanceService';
import {setToken} from './store/slices/authSlice';
import {setAllGrievances, setLatestGrievances} from './store/slices/grievanceSlice';
import {getUserDetails} from './services/operations/profileAPI';
import {setUser, clearProfile} from './store/slices/profileSlice';
import { ACCOUNT_TYPE } from "./utils/constants";

// Auth Routes
import OpenRoute from './components/Auth/OpenRoute';
import PrivateRoute from './components/Auth/PrivateRoute';

import { XMarkIcon, Bars2Icon } from "@heroicons/react/24/outline";
import Sidebar from './components/Common/Sidebar';

import HomePage from "./pages/HomePage";
import LoginModal from "./components/LoginModal";
import Header from './components/Common/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from "./pages/VerifyEmail";
import AllGrievancesPage from './pages/AllGrievancePage';
import About from './pages/About';
import Contact from './pages/Contact';
import GrievanceDetailsPage from "./pages/GrievanceDetailsPage";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CitizenDashboardLayout from './pages/CitizenDashboard/DashboardLayout';
import MyProfile from './pages/CitizenDashboard/MyProfile';
import MyGrievances from "./pages/CitizenDashboard/MyGrievances";
import SubmitGrievance from "./pages/CitizenDashboard/SubmitGrievance";
import Settings from "./pages/CitizenDashboard/Settings";
import ChangePassword from "./pages/CitizenDashboard/ChangePassword";

import DMDashboardLayout from './pages/DMDashboard/DashboardLayout';
import DMMyProfile from './pages/DMDashboard/MyProfile';
import ManageDepartments from './pages/DMDashboard/ManageDepartments';
import ManageGrievances from './pages/DMDashboard/ManageGrievances';
import AssignGrievance from "./pages/DMDashboard/AssignGrievance";
import DMSettings from "./pages/DMDashboard/Settings";
import DMChangePassword from "./pages/DMDashboard/ChangePassword";

import NodalDashboardLayout from './pages/NodalDashboard/DashboardLayout';
import NodalMyProfile from './pages/NodalDashboard/MyProfile';
import AssignedGrievances from './pages/NodalDashboard/AssignedGrievances';
import NodalSettings from './pages/NodalDashboard/Settings';
import NodalChangePassword from './pages/NodalDashboard/ChangePassword';


import DashboardRouter from "./routes/DashboardRouter";
import ProfileRoute from "./components/Common/ProfileRoute";


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.profile); // get user from redux state
  const {token} = useSelector((state) => state.auth);

  // Local state for UI elements and data that might not need global Redux
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Api call and handlers

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await login(loginForm.email, loginForm.password);
      dispatch(setToken(response.token)); // dispatch token to redux
      dispatch(setUser({
        _id: response._id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        accountType: response.accountType,
      }));

      toast.success(`Welcome, ${response.firstName}! You are logged in as ${response.accountType}.`);
      setShowLoginModal(false);
      setLoginForm({email: '', password: ''});
      //Re-fetch greivances after login, as user permissions might change what is visible
      fetchGrievancesData(true);
    }
    catch(err){
      toast.error(err.message || 'Login failed');
    }
    finally{
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(clearProfile());
    toast.success('You have been logged out.');
    navigate("/");
    setIsSidebarOpen(false);
    fetchGrievancesData(true); // ReFetch public grievances
  };

  const fetchGrievancesData = useCallback(async (isAuthenticated) => {
    setLoading(true);
    try{
      // fetch latest (limit 3 for homepage)
      const latestData = await fetchGrievancesService(isAuthenticated ? token : null, {limit: 5});
      dispatch(setLatestGrievances(latestData.grievances));

      // fetch all for stats
      if(isAuthenticated){
        const allData = await fetchGrievancesService(token);
        dispatch(setAllGrievances(allData.grievances));
      }
      else{
        dispatch(setAllGrievances([]));
      }
    }
    catch(err){
      if(!isAuthenticated && err.message.includes('401')){
        console.warn("Attempted to fetch all grievances without token (expected for public view).");
      }
      else{
        toast.error(err.message || 'Failed to fetch grievances');
      }
    }
    finally{
      setLoading(false);
    }
  }, [dispatch, token]);

  // Effects
  useEffect(() => {
    // This effect runs on initial load and when token changes (eg - after login/logout)
    // It fetches initial user details and grievnaces
    if(localStorage.getItem("raahToken")){
      const storedToken = localStorage.getItem("raahToken");
      dispatch(setToken(storedToken));

      dispatch(getUserDetails(storedToken, navigate));
      fetchGrievancesData(true);
    }
    else{
      fetchGrievancesData(true);
    }
  }, [dispatch, navigate, fetchGrievancesData]);

  useEffect(() => {
    if(token){
      fetchGrievancesData(true);
    }
    else{
      fetchGrievancesData(true);
    }
  }, [token, fetchGrievancesData]);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-gray-50 font-inter">

      {/* Header Component - Always visible */}
      <Header
        isLoggedIn={!!user}
        userAccountType={user?.accountType || null}
        setShowLoginModal={setShowLoginModal}
        handleLogout={handleLogout} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Mobile sidebar overlay */}
      {!user && (
    <>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      <Sidebar 
        userAccountType={null}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        variant="mobile-overlay"
        handleLogout={handleLogout}
      />
    </>
)}

     {/* React Router Routes */}
      <Routes>
      {/* Public Routes */}
        <Route path="/" element={<HomePage setShowLoginModal={setShowLoginModal}/>} /> {/*HomePage now gets data from Redux */}

        {/* open route - accessible only to non-logged in user */}
        <Route path="login" element={<OpenRoute><Login/></OpenRoute>}/>
        <Route path="signup" element={<OpenRoute><Signup/></OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>}/>
        <Route path="grievances" element={<AllGrievancesPage/>}/>
        <Route path="about" element={<About/>} />
        <Route path="contact" element={<Contact/>} />
        <Route path="grievances/:grievanceId" element={<GrievanceDetailsPage/>}/>
        <Route path="forgot-password" element={<ForgotPassword/>}/>
        <Route path="reset-password/:token" element={<ResetPassword />} />

        <Route path="dashboard/*" element={<PrivateRoute><DashboardRouter /></PrivateRoute>}>
          {/* Profile Route - renders correct component based on user type */}
          <Route path="my-profile" element={<ProfileRoute />} />
          
          {/* Citizen Routes */}
          <Route path="my-grievances" element={<MyGrievances />} />
          <Route path="submit-grievance" element={<SubmitGrievance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
          
          {/* DM Routes */}
          <Route path="assign-grievances" element={<AssignGrievance />} />
          <Route path="manage-departments" element={<ManageDepartments />} />
          <Route path="manage-grievances" element={<ManageGrievances />} />
          
          {/* Nodal Officer Routes */}
          <Route path="assigned-grievances" element={<AssignedGrievances />} />
        </Route>

        
      </Routes>

        {/* Login Modal Component - Still rendered globally, shown conditionally */}
        <LoginModal
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          handleLogin={handleLogin}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          loading={loading}
        />
    </div>
  );
}

export default App;