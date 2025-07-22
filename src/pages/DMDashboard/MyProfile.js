// src/pages/DMDashboard/MyProfile.js
import React from "react";
import { useSelector } from "react-redux";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Link } from "react-router-dom";
import Button from "../../components/Common/Button";

const COLORS = ['#34D399', '#FBBF24', '#F87171'];

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const { grievanceStats } = useSelector((state) => state.grievance);

  const chartData = [
    { name: "Resolved", value: grievanceStats.resolved },
    { name: "Pending", value: grievanceStats.pending },
    { name: "Rejected", value: grievanceStats.rejected },
  ];

  const getInitials = (first, last) => `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          {user.image ? (
            <img src={user.image} alt="DM" className="mx-auto w-24 h-24 rounded-full" />
          ) : (
            <div className="mx-auto w-24 h-24 rounded-full bg-blue-500 text-white text-2xl flex items-center justify-center">
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          <h2 className="text-3xl font-bold mt-4">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-600">District Magistrate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProfileField label="Email" value={user.email} />
            <ProfileField label="Account Type" value={user.accountType} />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Grievance Stats</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-4 font-medium text-blue-700">
              Total Grievances: {grievanceStats.total}
            </p>

            <Button className="mt-4">
              <Link to="/dashboard/manage-grievances">See Latest Grievances</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "N/A"}</p>
  </div>
);

export default MyProfile;
