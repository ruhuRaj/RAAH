import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Building2 } from 'lucide-react';

function LatestGrievanceCard({ grievance }) {
  if (!grievance) return null;
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-indigo-800 truncate pr-2">{grievance.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          grievance.status === 'Resolved' ? 'bg-green-100 text-green-700' :
          grievance.status === 'Rejected' ? 'bg-red-100 text-red-700' :
          grievance.status === 'Assigned' ? 'bg-purple-100 text-purple-700' :
          grievance.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
          'bg-amber-100 text-amber-800'
        }`}>{grievance.status}</span>
      </div>
      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{grievance.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
        <span className="flex items-center gap-1"><Tag className="h-4 w-4 text-indigo-400" />{grievance.category}</span>
        <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-green-400" />{grievance.location?.addressText || 'N/A'}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-purple-400" />{new Date(grievance.createdAt).toLocaleDateString()}</span>
        {grievance.department && (
          <span className="flex items-center gap-1"><Building2 className="h-4 w-4 text-blue-400" />{grievance.department.name || 'N/A'}</span>
        )}
      </div>
      <div className="mt-auto pt-2">
        <Link
          to={`/grievances/${grievance._id}`}
          className="block w-full text-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default LatestGrievanceCard; 