import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../utils/constants';
import { XMarkIcon } from '@heroicons/react/24/outline';

function Sidebar({ userAccountType, isSidebarOpen, setIsSidebarOpen, variant, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarLinks = [
    ...(variant === "mobile-overlay" ? [
      { name: "Home", path: "/", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE, null] },
      { name: "About", path: "/about", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE, null] },
      { name: "Contact", path: "/contact", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE, null] },
      { name: "All Grievances", path: "/grievances", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE, null] },
    ] : []),
    // ...(userAccountType ? [{ name: "Dashboard", path: "/dashboard/my-profile", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE] }] : []),
    { name: "My Profile", path: "/dashboard/my-profile", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE] },
    { name: "Settings", path: "/dashboard/settings", type: [ACCOUNT_TYPE.CITIZEN, ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE] },
    { name: "My Grievances", path: "/dashboard/my-grievances", type: [ACCOUNT_TYPE.CITIZEN] },
    { name: "Assigned Grievances", path: "/dashboard/assigned-grievances", type: [ACCOUNT_TYPE.NODAL_OFFICER, ACCOUNT_TYPE.DISTRICT_MAGISTRATE] },
    { name: "Manage Departments", path: "/dashboard/manage-departments", type: [ACCOUNT_TYPE.DISTRICT_MAGISTRATE] },
  ].filter(Boolean);

  const baseClasses = "py-8 text-white transition-transform duration-300 ease-in-out";
  const mobileOverlayClasses = `fixed inset-y-0 left-0 z-50 w-full max-w-[250px] transform bg-gray-900 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`;
  const desktopStaticClasses = "hidden md:flex md:static md:translate-x-0 md:border-r md:border-gray-700 md:flex-col min-w-[220px] bg-gray-900";

  return (
    <div className={`${baseClasses} ${variant === "mobile-overlay" ? mobileOverlayClasses : desktopStaticClasses}`}>      
      {variant === "mobile-overlay" && (
        <div className="absolute top-4 right-4">
          <button onClick={() => setIsSidebarOpen(false)} className="text-white focus:outline-none p-2 rounded-md hover:bg-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      <nav className="flex flex-col mt-8 md:mt-0 space-y-1">
        {sidebarLinks.map((link) => {
          const shouldShow = link.type.includes(userAccountType) || (link.type.includes(null) && !userAccountType);
          if (shouldShow) {
            return (
              <Link
                to={link.path}
                key={link.name}
                onClick={() => { if (variant === "mobile-overlay") setIsSidebarOpen(false); }}
                className={`relative px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "bg-blue-700 text-yellow-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          }
          return null;
        })}

        {/* Auth Buttons */}
        {variant === "mobile-overlay" && (
          <div className="mt-6 px-6">
            {!userAccountType ? (
              <>
                <button
                  onClick={() => { setIsSidebarOpen(false); navigate("/login"); }}
                  className="w-full px-4 py-2 mb-2 bg-white text-blue-700 rounded-md hover:bg-gray-100 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsSidebarOpen(false); navigate("/signup"); }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
