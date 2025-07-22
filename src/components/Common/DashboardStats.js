import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DashboardStats = ({ stats, userType, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Statistics</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Prepare data for pie chart - show all categories even with zero values
  const pieData = [
    { name: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgress || 0, color: '#3b82f6' },
    { name: 'Resolved', value: stats.resolved || 0, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#ef4444' },
  ];

  const getTitle = () => {
    switch (userType) {
      case 'Citizen':
        return 'My Grievances Overview';
      case 'Nodal Officers':
        return 'Assigned Grievances Overview';
      case 'District Magistrate':
        return 'District Grievances Overview';
      default:
        return 'Grievances Overview';
    }
  };

  const getSubtitle = () => {
    switch (userType) {
      case 'Citizen':
        return `Total grievances submitted: ${stats.total}`;
      case 'Nodal Officers':
        return `Total grievances assigned: ${stats.total}`;
      case 'District Magistrate':
        return `Total grievances in district: ${stats.total}`;
      default:
        return `Total grievances: ${stats.total}`;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-gray-600">{payload[0].value} grievances</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{getTitle()}</h3>
        <p className="text-gray-600">{getSubtitle()}</p>
      </div>

      <div className="space-y-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-gray-700 font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-yellow-800">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending || 0}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-blue-800">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress || 0}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-800">Resolved</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.resolved || 0}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-red-800">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">{stats.rejected || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 