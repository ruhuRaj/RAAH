import { apiConnector } from "./apiConnector";
import { GRIEVANCE_ENDPOINTS } from "./apis";

// Fetch all (optionally with params)
export const fetchGrievances = async (token = null, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${GRIEVANCE_ENDPOINTS.GET_ALL_GRIEVANCES_API}${queryString ? `?${queryString}` : ''}`;
  return apiConnector('GET', url, null, token);
};

// Create new grievance
export const createGrievance = async (formData, token) => {
  return apiConnector('POST', GRIEVANCE_ENDPOINTS.CREATE_GRIEVANCES_API, formData, token, true);
};

// Get single grievance
export const getGrievanceById = async (grievanceId, token=null) => {
  return apiConnector('GET', `${GRIEVANCE_ENDPOINTS.GET_ALL_GRIEVANCES_API}/${grievanceId}`, null, token);
};

// Update grievance (status/feedback)
export const updateGrievance = async (grievanceId, updateData, token) => {
  return apiConnector('PUT', `${GRIEVANCE_ENDPOINTS.UPDATE_GRIEVANCES_API}/${grievanceId}`, updateData, token);
};

// Add comment
export const addGrievanceComment = async (grievanceId, commentData, token) => {
  return apiConnector('POST', `${GRIEVANCE_ENDPOINTS.ADD_GRIEVANCES_COMMENT_API}/${grievanceId}/comments`, commentData, token);
};

// Get grievance statistics for dashboard
export const getGrievanceStats = async (token) => {
  return apiConnector('GET', GRIEVANCE_ENDPOINTS.GET_GRIEVANCE_STATS_API, null, token);
};

// Get unassigned grievances (DM only)
export const getUnassignedGrievances = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${GRIEVANCE_ENDPOINTS.GET_UNASSIGNED_GRIEVANCES_API}${queryString ? `?${queryString}` : ''}`;
  return apiConnector('GET', url, null, token);
};

// Get assigned grievances (Nodal Officers only)
export const getAssignedGrievances = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${GRIEVANCE_ENDPOINTS.GET_ASSIGNED_GRIEVANCES_API}${queryString ? `?${queryString}` : ''}`;
  return apiConnector('GET', url, null, token);
};

// Get all assigned grievances (DM only)
export const getAllAssignedGrievances = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${GRIEVANCE_ENDPOINTS.GET_ALL_GRIEVANCES_API}?assignedTo=true${queryString ? `&${queryString}` : ''}`;
  return apiConnector('GET', url, null, token);
};

// Assign grievance to department (DM only)
export const assignGrievance = async (grievanceId, assignmentData, token) => {
  return apiConnector('PUT', `${GRIEVANCE_ENDPOINTS.ASSIGN_GRIEVANCE_API}/${grievanceId}/assign`, assignmentData, token);
};

// Delete grievance (DM only)
export const deleteGrievance = async (grievanceId, token) => {
  return apiConnector('DELETE', `${GRIEVANCE_ENDPOINTS.DELETE_GRIEVANCE_API}/${grievanceId}`, null, token);
};
