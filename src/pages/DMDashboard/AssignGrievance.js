import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUnassignedGrievances, getAllAssignedGrievances, assignGrievance, addGrievanceComment } from "../../services/grievanceService";
import { getAllDepartments } from "../../services/departmentService";
import { useSelector } from "react-redux";
import ClickableGrievanceTitle from "../../components/Common/ClickableGrievanceTitle";
import { Search, Filter } from "lucide-react";

function AssignGrievance() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  const [unassignedGrievances, setUnassignedGrievances] = useState([]);
  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState({});
  const [assignmentMessages, setAssignmentMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [addingComment, setAddingComment] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [debouncedSearchTerm, statusFilter]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const [unassignedRes, assignedRes, deptRes] = await Promise.all([
        getUnassignedGrievances(params, token),
        getAllAssignedGrievances(params, token),
        getAllDepartments(token)
      ]);
      setUnassignedGrievances(unassignedRes.grievances || []);
      setAssignedGrievances(assignedRes.grievances || []);
      setDepartments(deptRes.departments || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch grievances or departments");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (grievanceId) => {
    const deptId = selectedDepartments[grievanceId];
    const message = assignmentMessages[grievanceId] || "";
    
    if (!deptId) {
      toast.error("Please select a department first.");
      return;
    }

    try {
      setAssigning(prev => ({ ...prev, [grievanceId]: true }));
      await assignGrievance(grievanceId, { department: deptId, message }, token);
      toast.success("Grievance assigned successfully");
      
      // Clear selections
      setSelectedDepartments(prev => {
        const newState = { ...prev };
        delete newState[grievanceId];
        return newState;
      });
      setAssignmentMessages(prev => {
        const newState = { ...prev };
        delete newState[grievanceId];
        return newState;
      });
      
      fetchData(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign grievance");
    } finally {
      setAssigning(prev => ({ ...prev, [grievanceId]: false }));
    }
  };

  const handleAddComment = async (grievanceId) => {
    const commentText = commentTexts[grievanceId] || "";
    
    if (!commentText.trim()) {
      toast.error("Please enter a comment first.");
      return;
    }

    try {
      setAddingComment(prev => ({ ...prev, [grievanceId]: true }));
      await addGrievanceComment(grievanceId, { text: commentText, isPublic: true }, token);
      toast.success("Comment added successfully");
      
      // Clear comment text
      setCommentTexts(prev => {
        const newState = { ...prev };
        delete newState[grievanceId];
        return newState;
      });
      
      fetchData(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    } finally {
      setAddingComment(prev => ({ ...prev, [grievanceId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Reopened':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                              </div>
              ))}
        </div>
      </div>

      {/* Assigned Grievances */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Assigned Grievances</h2>
        </div>

        <div className="p-6">
          {assignedGrievances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Grievances</h3>
              <p className="text-gray-500">No grievances have been assigned to departments yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignedGrievances.map((grievance) => (
                <div
                  key={grievance._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <ClickableGrievanceTitle 
                        title={grievance.title}
                        grievanceId={grievance._id}
                        className="text-lg font-semibold text-gray-800 mb-2"
                      />
                      <p className="text-gray-600 text-sm mb-3">{grievance.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grievance.status)}`}>
                          {grievance.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                          {grievance.priority} Priority
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grievance.category}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <p><strong>Submitted by:</strong> {grievance.user?.firstName} {grievance.user?.lastName}</p>
                        <p><strong>Department:</strong> {grievance.department?.name}</p>
                        <p><strong>Assigned to:</strong> {grievance.assignedTo?.firstName} {grievance.assignedTo?.lastName}</p>
                        <p><strong>Assigned by:</strong> {grievance.assignedBy?.firstName} {grievance.assignedBy?.lastName}</p>
                        <p><strong>Date:</strong> {new Date(grievance.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assign Grievances</h1>
        <p className="text-gray-600">Assign unassigned grievances to appropriate departments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Unassigned</p>
              <p className="text-2xl font-bold text-gray-900">{unassignedGrievances.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{assignedGrievances.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search grievances by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || statusFilter) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Unassigned Grievances */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-red-600">Unassigned Grievances</h2>
        </div>

        <div className="p-6">
          {unassignedGrievances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No unassigned grievances at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {unassignedGrievances.map((grievance) => (
                <div
                  key={grievance._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <ClickableGrievanceTitle 
                        title={grievance.title}
                        grievanceId={grievance._id}
                        className="text-lg font-semibold text-gray-800 mb-2"
                      />
                      <p className="text-gray-600 text-sm mb-3">{grievance.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grievance.status)}`}>
                          {grievance.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                          {grievance.priority} Priority
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grievance.category}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p><strong>Submitted by:</strong> {grievance.user?.firstName} {grievance.user?.lastName}</p>
                        <p><strong>Date:</strong> {new Date(grievance.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Department
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={selectedDepartments[grievance._id] || ""}
                          onChange={(e) =>
                            setSelectedDepartments((prev) => ({
                              ...prev,
                              [grievance._id]: e.target.value,
                            }))
                          }
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assignment Message (Optional)
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="2"
                          placeholder="Add a note for the nodal officer..."
                          value={assignmentMessages[grievance._id] || ""}
                          onChange={(e) =>
                            setAssignmentMessages((prev) => ({
                              ...prev,
                              [grievance._id]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleAssign(grievance._id)}
                        disabled={assigning[grievance._id] || !selectedDepartments[grievance._id]}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition duration-200 flex items-center"
                      >
                        {assigning[grievance._id] ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Assigning...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Assign Grievance
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assigned Grievances */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Assigned Grievances</h2>
        </div>

        <div className="p-6">
          {assignedGrievances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Grievances</h3>
              <p className="text-gray-500">No grievances have been assigned to departments yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignedGrievances.map((grievance) => (
                <div
                  key={grievance._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <ClickableGrievanceTitle 
                        title={grievance.title}
                        grievanceId={grievance._id}
                        className="text-lg font-semibold text-gray-800 mb-2"
                      />
                      <p className="text-gray-600 text-sm mb-3">{grievance.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grievance.status)}`}>
                          {grievance.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(grievance.priority)}`}>
                          {grievance.priority} Priority
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grievance.category}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 space-y-1">
                        <p><strong>Submitted by:</strong> {grievance.user?.firstName} {grievance.user?.lastName}</p>
                        <p><strong>Department:</strong> {grievance.department?.name}</p>
                        <p><strong>Assigned to:</strong> {grievance.assignedTo?.firstName} {grievance.assignedTo?.lastName}</p>
                        <p><strong>Assigned by:</strong> {grievance.assignedBy?.firstName} {grievance.assignedBy?.lastName}</p>
                        <p><strong>Date:</strong> {new Date(grievance.createdAt).toLocaleDateString()}</p>
                      </div>

                      {/* Status Updates & Notes */}
                      {grievance.comments && grievance.comments.length > 0 && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Status Updates & Notes</h4>
                          <ul className="space-y-2">
                            {grievance.comments.map((comment, idx) => (
                              <li key={idx} className="border-b last:border-b-0 pb-2 last:pb-0">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span className="font-medium text-gray-800">
                                    {comment.user?.firstName} {comment.user?.lastName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    ({comment.user?.accountType})
                                  </span>
                                  <span className="ml-auto text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="ml-2 text-gray-700">{comment.text}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Add Comment Section */}
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Add Note</h4>
                        <div className="space-y-3">
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder="Add a note or instruction for the nodal officer..."
                            value={commentTexts[grievance._id] || ""}
                            onChange={(e) =>
                              setCommentTexts((prev) => ({
                                ...prev,
                                [grievance._id]: e.target.value,
                              }))
                            }
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleAddComment(grievance._id)}
                              disabled={addingComment[grievance._id] || !commentTexts[grievance._id]?.trim()}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center"
                            >
                              {addingComment[grievance._id] ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add Note
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignGrievance;
