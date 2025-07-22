import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Common/Sidebar';
import { useSelector } from 'react-redux';
import DashboardStats from '../../components/Common/DashboardStats';
import { getGrievanceStats } from '../../services/grievanceService';
import toast from 'react-hot-toast';

function DMDashboardLayout({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const showDashboard = location.pathname === '/dashboard/my-profile';

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
        {showDashboard ? (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome, District Magistrate!</h1>
              <p className="text-purple-100">Here's an overview of district grievances</p>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats 
              stats={stats} 
              userType="District Magistrate" 
              loading={loading} 
            />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/dashboard/assign-grievances')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Assign Grievances
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/manage-departments')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Manage Departments
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/manage-grievances')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Manage Grievances
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">District Management</p>
                      <p className="text-xs text-gray-500">Oversee all district grievances</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Department Control</p>
                      <p className="text-xs text-gray-500">Manage departments and assignments</p>
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

export default DMDashboardLayout;
