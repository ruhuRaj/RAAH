import { apiConnector } from "../apiConnector";
import { GRIEVANCE_ENDPOINTS } from "../apis";

const {
  GET_ALL_GRIEVANCES_API,
  CREATE_GRIEVANCES_API,
  GET_GRIEVANCES_BY_ID_API,
  UPDATE_GRIEVANCES_API,
  ADD_GRIEVANCES_COMMENT_API,
  ASSIGN_GRIEVANCE_API,
} = GRIEVANCE_ENDPOINTS;

// 1. Get all grievances (for DM, Nodal, Citizen depending on auth)
export const getAllGrievances = async (token) => {
  return await apiConnector("GET", GET_ALL_GRIEVANCES_API, null, token);
};

// 2. Create grievance (for Citizens)
export const createGrievance = async (formData, token) => {
  return await apiConnector("POST", CREATE_GRIEVANCES_API, formData, token, true);
};

// 3. Get single grievance by ID
export const getGrievanceById = async (grievanceId, token = null) => {
  return await apiConnector("GET", `${GET_GRIEVANCES_BY_ID_API}/${grievanceId}`, null, token);
};

// 4. Update grievance (status, resolution, feedback, etc.)
export const updateGrievance = async (grievanceId, updateData, token) => {
  return await apiConnector("PUT", `${UPDATE_GRIEVANCES_API}/${grievanceId}`, updateData, token);
};

// 5. Add comment to a grievance
export const addGrievanceComment = async (grievanceId, commentData, token) => {
  return await apiConnector("POST", `${ADD_GRIEVANCES_COMMENT_API}/${grievanceId}/comments`, commentData, token);
};

// 6. Assign grievance to department (DM action)
export const assignGrievanceToDepartment = async (grievanceId, departmentId, token) => {
  return await apiConnector("PUT", `${ASSIGN_GRIEVANCE_API}/${grievanceId}`, { department: departmentId }, token);
};

// 7. Get grievances for specific department (Nodal Officer)
export const getAssignedGrievances = async (departmentId, token) => {
  return await apiConnector("GET", `${GET_ALL_GRIEVANCES_API}?department=${departmentId}`, null, token);
};
