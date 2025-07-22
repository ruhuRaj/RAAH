import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Common/Sidebar';
import { useSelector } from 'react-redux';
import DashboardStats from '../../components/Common/DashboardStats';
import { getGrievanceStats } from '../../services/grievanceService';
import NodalMyProfile from './MyProfile';
import toast from 'react-hot-toast';

function NodalDashboardLayout({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (token) {
        try {
          const data = await getGrievanceStats(token);
          setStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
          toast.error('Failed to load dashboard statistics');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [token]);

  // Show dashboard overview on the main profile route
  const showDashboard = location.pathname === '/dashboard/my-profile' && !showProfile;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userAccountType={user?.accountType || null}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        variant="mobile-overlay"
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {showProfile ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
            <NodalMyProfile />
          </div>
        ) : showDashboard ? (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome, Nodal Officer!</h1>
              <p className="text-green-100">Here's an overview of your assigned grievances</p>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats 
              stats={stats} 
              userType="Nodal Officers" 
              loading={loading} 
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard/assigned-grievances')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View Assigned Grievances
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Update Profile
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Grievance Management</p>
                      <p className="text-xs text-gray-500">Handle assigned grievances efficiently</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Status Updates</p>
                      <p className="text-xs text-gray-500">Keep citizens informed of progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default NodalDashboardLayout;
