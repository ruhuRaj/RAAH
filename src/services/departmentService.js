// src/services/departmentService.js

import { apiConnector } from "./apiConnector";
import { DEPARTMENT_ENDPOINTS } from "./apis";

const {
  GET_ALL_DEPARTMENTS_API,
  CREATE_DEPARTMENT_API,
  UPDATE_DEPARTMENT_API,
  DELETE_DEPARTMENT_API,
} = DEPARTMENT_ENDPOINTS;

// Fetch all departments
// Fetch all departments
export const getAllDepartments = async (token) => {
  const response = await apiConnector("GET", GET_ALL_DEPARTMENTS_API, null, token);

  // Handle both: array or object
  if (Array.isArray(response)) {
    return { departments: response }; // convert to expected format
  }

  return response;
};




// Create a new department
export const createDepartment = async (data, token) => {
  return await apiConnector("POST", CREATE_DEPARTMENT_API, data, token);
};

// Update department
export const updateDepartment = async (id, data, token) => {
  return await apiConnector("PUT", `${UPDATE_DEPARTMENT_API}/${id}`, data, token);
};

// Delete department
export const deleteDepartment = async (id, token) => {
  return await apiConnector("DELETE", `${DELETE_DEPARTMENT_API}/${id}`, null, token);
};
