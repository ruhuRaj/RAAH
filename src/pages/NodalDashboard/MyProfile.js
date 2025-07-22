import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllDepartments } from "../../services/departmentService"; 
import { updateProfile } from "../../services/operations/profileAPI";
import { setUser } from "../../store/slices/profileSlice";
import { setAssignedGrievances } from "../../store/slices/grievanceSlice";
import { getAssignedGrievances } from "../../services/grievanceService";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

function MyProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { assignedGrievances } = useSelector((state) => state.grievance);

  const [editMode, setEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    contactNumber: "",
    address: "",
    department: "",
  });
  const [updating, setUpdating] = useState(false);

  // Load departments for dropdown
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await getAllDepartments(token);
        setDepartments(res?.departments || []);
      } catch (error) {
        toast.error("Failed to load departments");
      }
    };
    loadDepartments();
  }, [token]);

  // Load assigned grievances
  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await getAssignedGrievances({}, token);
        dispatch(setAssignedGrievances(res?.grievances || []));
      } catch (err) {
        console.error("Failed to fetch assigned grievances", err);
      }
    };
    fetchAssigned();
  }, [dispatch, token]);

  // Load profile data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.additionalDetails?.gender || "",
        dob: user.additionalDetails?.dob?.split("T")[0] || "",
        contactNumber: user.additionalDetails?.contactNumber || "",
        address: user.additionalDetails?.address || "",
        department: user.department?._id || user.department || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (user?.accountType === "Nodal Officers" && !formData.department) {
      toast.error("Department is required for Nodal Officers");
      return;
    }

    try {
      setUpdating(true);
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        contactNumber: formData.contactNumber.trim(),
        address: formData.address.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dob,
        department: user.accountType === "Nodal Officers" ? formData.department : undefined,
      };
      
      const response = await updateProfile(user._id, payload, token);
      if (response && response.updatedUser) {
        dispatch(setUser(response.updatedUser));
        localStorage.setItem("raahUser", JSON.stringify(response.updatedUser));
        toast.success("Profile updated successfully");
        setEditMode(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const pieData = {
    labels: ["Assigned Grievances"],
    datasets: [
      {
        label: "Assigned Grievances",
        data: [assignedGrievances?.length || 0],
        backgroundColor: ["#3B82F6"],
        borderColor: ["#1D4ED8"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow rounded">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
      


      {/* Pie Chart */}
      {/* <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Grievance Stats :</h3>
        <div className="w-64 h-64 mx-auto">
          <Pie data={pieData} />
        </div>
        <p className="text-center text-gray-700 mt-2">
          <strong>Total Grievances Assigned:</strong> {assignedGrievances?.length || 0}
        </p>
      </div> */}

      {/* Profile Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!editMode} />
        <TextInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!editMode} />
        <SelectInput label="Gender" name="gender" value={formData.gender} onChange={handleChange} disabled={!editMode}
          options={[
            { value: "", label: "-- Select Gender --" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <TextInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} disabled={!editMode} />
        <TextInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} disabled={!editMode} />
        <TextInput label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!editMode} />

        {user?.accountType === "Nodal Officers" && (
          <div className="sm:col-span-2">
            <label className="text-gray-600">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full border px-3 py-2 rounded ${!editMode ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
            >
              <option value="">-- Select Department --</option>
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

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {updating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={() => setEditMode(false)}
              disabled={updating}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Edit Profile
          </button>
        )}

        {/* {user?.accountType === "Nodal Officers" && (
          <Link
            to="/dashboard/assigned-grievances"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            📂 See Assigned Grievances
          </Link>
        )} */}
      </div>
    </div>
  );
}

const TextInput = ({ label, name, value, onChange, disabled = false, type = "text" }) => (
  <div>
    <label className="text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border px-3 py-2 rounded ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-text'}`}
    />
  </div>
);

const SelectInput = ({ label, name, value, onChange, disabled, options }) => (
  <div>
    <label className="text-gray-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border px-3 py-2 rounded ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default MyProfile;
