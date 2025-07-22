import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Calendar, MapPin, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Building2 } from 'lucide-react'; // Ensure Building2 is imported

function GrievanceCard({ grievance }) {
    // Determine status color and icon
    let statusColor = 'bg-gray-200 text-gray-800';
    let statusIcon = Clock; // Default icon
    switch (grievance.status) {
        case 'Pending':
            statusColor = 'bg-amber-100 text-amber-800';
            statusIcon = AlertCircle;
            break;
        case 'In Progress':
            statusColor = 'bg-blue-100 text-blue-800';
            statusIcon = Clock;
            break;
        case 'Resolved':
            statusColor = 'bg-green-100 text-green-800';
            statusIcon = CheckCircle;
            break;
        case 'Rejected':
            statusColor = 'bg-red-100 text-red-800';
            statusIcon = XCircle;
            break;
        default:
            break;
    }

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col min-h-64 border border-gray-200">
            {/* Header with Title and Status */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900 leading-tight pr-2">
                    {grievance.title}
                </h3>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor} whitespace-nowrap`}>
                    {React.createElement(statusIcon, { className: "h-4 w-4 mr-1" })}
                    {grievance.status}
                </div>
            </div>

            {/* Body with Details */}
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <p className="text-gray-700 mb-3 text-sm line-clamp-3">
                        {grievance.description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-indigo-500" />
                            <span>Category: {grievance.category}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-green-500" />
                            {/* FIX: Access grievance.location.addressText */}
                            <span>Location: {grievance.location?.addressText || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Date: {formatDate(grievance.createdAt)}</span>
                        </div>
                        {grievance.department && (
                            <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                                {/* Safeguard for department name */}
                                <span>Department: {grievance.department.name || 'N/A'}</span>
                            </div>
                        )}
                        {grievance.comments && grievance.comments.length > 0 && (
                            <div className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                                <span>Comments: {grievance.comments.length}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer with View Details Button */}
            <div className="p-4 border-t border-gray-200">
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

export default GrievanceCard;
