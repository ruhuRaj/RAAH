// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ACCOUNT_TYPE } from '../../utils/constants';
// import { Bars3Icon } from '@heroicons/react/24/outline';

// function Navbar({ isLoggedIn, userAccountType, handleLogout, toggleSidebar }) {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const renderDropdownItems = () => {
//   const linkClasses = "block px-4 py-2 hover:bg-gray-100";

//   if (userAccountType === ACCOUNT_TYPE.CITIZEN) {
//     return (
//       <>
//         <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
//         <Link to="/dashboard/my-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Grievances</Link>
//         <Link to="/dashboard/submit-grievance" className={linkClasses} onClick={() => setDropdownOpen(false)}>Submit Grievance</Link>
//         <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
//         <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
//       </>
//     );
//   }

//   if (userAccountType === ACCOUNT_TYPE.NODAL_OFFICER) {
//     return (
//       <>
//         <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
//         <Link to="/dashboard/assigned-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Assigned Grievances</Link>
//         <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
//         <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
//       </>
//     );
//   }

//   if (userAccountType === ACCOUNT_TYPE.DISTRICT_MAGISTRATE) {
//     return (
//       <>
//         <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
//         <Link to="/dashboard/assigned-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Assign Grievances</Link>
//         <Link to="/dashboard/manage-departments" className={linkClasses} onClick={() => setDropdownOpen(false)}>Manage Departments</Link>
//         <Link to="/dashboard/manage-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Manage Grievances</Link>
//         <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
//         <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
//       </>
//     );
//   }

//   return null;
//   };

//   return (
//     <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
//       <nav className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="text-2xl font-bold">
//           <Link to="/">RAAH</Link>
//         </div>

//         {isLoggedIn ? (
//           <div className="flex items-center space-x-4">
//             {/* Dashboard Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen((prev) => !prev)}
//                 className="px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-800"
//               >
//                 Dashboard
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg z-50">
//                   {renderDropdownItems()}
//                 </div>
//               )}
//             </div>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-all duration-200"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="hover:text-blue-200 transition-all duration-200">Home</Link>
//             <Link to="/about" className="hover:text-blue-200 transition-all duration-200">About</Link>
//             <Link to="/contact" className="hover:text-blue-200 transition-all duration-200">Contact</Link>
//             <Link to="/grievances" className="hover:text-blue-200 transition-all duration-200">All Grievances</Link>
//             <button
//               onClick={() => navigate("/login")}
//               className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-all duration-200"
//             >
//               Log In
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-all duration-200"
//             >
//               Sign Up
//             </button>
//           </div>
//         )}

//         {/* Mobile Sidebar Toggle — Show only when not logged in */}
//         {!isLoggedIn && (
//           <div className="md:hidden">
//             <button onClick={toggleSidebar} className="text-white focus:outline-none p-2 rounded-md hover:bg-blue-700 transition-colors">
//               <Bars3Icon className="h-8 w-8" />
//             </button>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }

// export default Navbar;






import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { ACCOUNT_TYPE } from '../../utils/constants';

function Navbar({ isLoggedIn, userAccountType, handleLogout, toggleSidebar }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDropdownItems = () => {
    const linkClasses = "block px-4 py-2 hover:bg-gray-100";

    switch (userAccountType) {
      case ACCOUNT_TYPE.CITIZEN:
        return (
          <>
            <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
            <Link to="/dashboard/my-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Grievances</Link>
            <Link to="/dashboard/submit-grievance" className={linkClasses} onClick={() => setDropdownOpen(false)}>Submit Grievance</Link>
            <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
            <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
          </>
        );

      case ACCOUNT_TYPE.NODAL_OFFICER:
        return (
          <>
            <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
            <Link to="/dashboard/assigned-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Assigned Grievances</Link>
            <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
            <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
          </>
        );

      case ACCOUNT_TYPE.DISTRICT_MAGISTRATE:
        return (
          <>
            <Link to="/dashboard/my-profile" className={linkClasses} onClick={() => setDropdownOpen(false)}>My Profile</Link>
            <Link to="/dashboard/assign-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Assign Grievances</Link>
            <Link to="/dashboard/manage-departments" className={linkClasses} onClick={() => setDropdownOpen(false)}>Manage Departments</Link>
            <Link to="/dashboard/manage-grievances" className={linkClasses} onClick={() => setDropdownOpen(false)}>Manage Grievances</Link>
            <Link to="/dashboard/settings" className={linkClasses} onClick={() => setDropdownOpen(false)}>Settings</Link>
            <Link to="/dashboard/change-password" className={linkClasses} onClick={() => setDropdownOpen(false)}>Change Password</Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <header className="bg-blue-600 text-white p-3 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">RAAH</Link>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* Dropdown for Dashboard */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="px-4 py-2 rounded-md bg-blue-700 text-white font-semibold relative z-10 animated-border"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                Dashboard
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-md shadow-lg z-50">
                  {renderDropdownItems()}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            <Link to="/about" className="hover:text-blue-200">About</Link>
            <Link to="/contact" className="hover:text-blue-200">Contact</Link>
            <Link to="/grievances" className="hover:text-blue-200">All Grievances</Link>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100"
            >
              Sign Up
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <div className="md:hidden">
            <button onClick={toggleSidebar} className="text-white p-2 rounded-md hover:bg-blue-700 transition">
              <Bars3Icon className="h-8 w-8" />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
