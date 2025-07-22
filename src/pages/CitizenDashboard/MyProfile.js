import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { updateProfile, uploadProfileImage } from '../../services/operations/profileAPI';
import { getAllDepartments } from '../../services/departmentService';
import { setUser } from '../../store/slices/profileSlice';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Common/Button';

const COLORS = ['#34D399', '#FBBF24', '#F87171']; // Resolved, Pending, Rejected

function MyProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);
  const { allGrievances } = useSelector((state) => state.grievance);
  const token = useSelector((state) => state.auth.token);

  const isNodalOfficer = user?.accountType === 'Nodal Officers';

  const additional = user?.additionalDetails || {};
  const departmentId = user?.department?._id || user?.department;

  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    contactNumber: additional?.contactNumber || '',
    address: additional?.address || '',
    gender: additional?.gender || 'Prefer not to say',
    dateOfBirth: additional?.dateOfBirth?.split('T')[0] || '',
    department: departmentId || '',
  });

  useEffect(() => {
  if (isNodalOfficer) {
    getAllDepartments()
      .then((res) => {
        if (Array.isArray(res)) {
          setDepartments(res);
        } else if (Array.isArray(res.departments)) {
          setDepartments(res.departments);
        } else {
          setDepartments([]);
        }
      })
      .catch(() => {
        toast.error('Failed to load departments');
      });
  }
}, [isNodalOfficer]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(user._id, formData, token);
      dispatch(setUser(response.updatedUser)); // Only the user object
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadProfileImage(user._id, file, token));
  };

  const getInitials = (first, last) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  };

  const filteredGrievances = (() => {
    switch (user.accountType) {
      case "District Magistrate":
        return allGrievances;
      case "Nodal Officers":
        // For Nodal Officers, show only grievances assigned to them specifically
        return allGrievances.filter(g => g.assignedTo?._id === user?._id || g.assignedTo === user?._id);
      case "Citizen":
      default:
        // For Citizens, show grievances they submitted
        return allGrievances.filter(g => g.user?._id === user?._id);
    }
  })();

  const resolved = filteredGrievances.filter(g => g.status === 'Resolved').length;
  const rejected = filteredGrievances.filter(g => g.status === 'Rejected').length;
  const pending = filteredGrievances.length - resolved - rejected;

  const chartData = [
    { name: 'Resolved', value: resolved },
    { name: 'Pending', value: pending },
    { name: 'Rejected', value: rejected },
  ];

  // When entering edit mode, always sync formData with latest user data
  const handleEditClick = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      contactNumber: additional?.contactNumber || '',
      address: additional?.address || '',
      gender: additional?.gender || 'Prefer not to say',
      dateOfBirth: additional?.dateOfBirth?.split('T')[0] || '',
      department: departmentId || '',
    });
    setIsEditing(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="relative w-24 h-24 mx-auto mb-4 -mt-3">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}

          <label className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-blue-100 transition-all border border-gray-300">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Camera size={18} className="text-blue-600" />
          </label>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">My Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {!isEditing ? (
              <>
                <ProfileField label="First Name" value={user?.firstName} />
                <ProfileField label="Last Name" value={user?.lastName} />
                <ProfileField label="Email" value={user?.email} />
                <ProfileField label="Contact Number" value={additional?.contactNumber} />
                <ProfileField label="Gender" value={additional?.gender} />
                <ProfileField label="Date of Birth" value={additional?.dateOfBirth?.split('T')[0]} />
                <ProfileField label="Address" value={additional?.address} />
                <ProfileField label="Account Type" value={user?.accountType} />
                {user?.department?.name && (
                  <ProfileField label="Department" value={user.department.name} />
                )}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                  <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                  <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-600 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
                  <InputField label="Email" name="email" value={user.email} disabled />
                  {isNodalOfficer && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                      >
                        <option value="">-- Select a department --</option>
                        {Array.isArray(departments) &&
                          departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.name}
                            </option>
                          ))}

                        </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    💾 Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Grievance Stats */}
          <div className="flex flex-col items-center">
            <h1 className="text-[30px] font-bold text-gray-700">Grievance Stats :</h1>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} grievances`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
            <p className="font-bold mt-4 text-gray-700 mb-6">
  {user.accountType === 'Nodal Officers' ? (
    <>
      Total Assigned Grievances: <span className="font-semibold text-blue-600">{filteredGrievances.length}</span>
    </>
  ) : (
    <>
      Total Grievances: <span className="font-semibold text-blue-600">{filteredGrievances.length}</span>
    </>
  )}
</p>

<Button>
  <Link
    to={
      user.accountType === 'District Magistrate'
        ? '/grievances'
        : user.accountType === 'Nodal Officers'
        ? '/dashboard/assigned-grievances'
        : '/dashboard/submit-grievance'
    }
  >
    {user.accountType === 'District Magistrate'
      ? '📋 See Latest Grievances'
      : user.accountType === 'Nodal Officers'
      ? '📂 See Assigned Grievances'
      : '✉️ Submit New Grievance'}
  </Link>
</Button>

          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileField = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4 shadow-sm mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || 'N/A'}</p>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", disabled }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
    />
  </div>
);

export default MyProfile;