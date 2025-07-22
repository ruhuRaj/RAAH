export const BASE_URL = 'http://localhost:4000/api'

// AUTH ENDPOINTS
export const AUTH_ENDPOINTS = {
    LOGIN_API: BASE_URL + '/auth/login', 
    REGISTER_USER_API: BASE_URL + '/auth/register',
    REGISTER_STAFF_API: BASE_URL + '/users/register-staff',
    FORGOT_PASSWORD_API: BASE_URL + '/auth/forgot-password',
    RESET_PASSWORD_API: BASE_URL + '/auth/reset-password',
    GET_ALL_USERS_API: BASE_URL + '/users',
    UPDATE_USERS_STATUS_API: BASE_URL + '/users',
    SEND_OTP_API: BASE_URL + '/auth/send-otp',
    VERIFY_OTP_API: BASE_URL + '/auth/verify-otp',
    CHANGE_PASSWORD_API: BASE_URL + '/auth/change-password',
    DELETE_ACCOUNT_API: BASE_URL + '/auth/delete-account',
};

// DEPARTMENT ENDPOINTS
export const DEPARTMENT_ENDPOINTS = {
    GET_ALL_DEPARTMENTS_API: BASE_URL + '/departments',
    CREATE_DEPARTMENT_API: BASE_URL + '/departments',
    UPDATE_DEPARTMENT_API: BASE_URL + '/departments',
    DELETE_DEPARTMENT_API: BASE_URL + '/departments',
};

// GRIEVANCE ENDPOINTS
export const GRIEVANCE_ENDPOINTS = {
    GET_ALL_GRIEVANCES_API: BASE_URL + '/grievances',
    CREATE_GRIEVANCES_API: BASE_URL + '/grievances',
    GET_GRIEVANCES_BY_ID_API: BASE_URL + '/grievances',
    UPDATE_GRIEVANCES_API: BASE_URL + '/grievances',
    DELETE_GRIEVANCE_API: BASE_URL + '/grievances',
    ADD_GRIEVANCES_COMMENT_API: BASE_URL + '/grievances',
    ASSIGN_GRIEVANCE_API: BASE_URL + '/grievances',
    GET_GRIEVANCE_STATS_API: BASE_URL + '/grievances/stats/dashboard',
    GET_UNASSIGNED_GRIEVANCES_API: BASE_URL + '/grievances/unassigned',
    GET_ASSIGNED_GRIEVANCES_API: BASE_URL + '/grievances/assigned',
};

// WORK PROGRESS ENDPOINTS
export const WORK_PROGRESS_ENDPOINTS = {
    GET_WORK_PROGRESS_ENTRIES_API: BASE_URL + '/work-progress',
    GET_WORK_PROGRESS_ENTRY_BY_ID_API: BASE_URL + '/work-progress',
    UPDATE_WORK_PROGRESS_API: BASE_URL + '/work-progress',
}

export const PROFILE_ENDPOINTS = {
    GET_USER_PROFILE: (userId) => `${BASE_URL}/profiles/${userId}`,
    UPDATE_USER_PROFILE: (userId) => `${BASE_URL}/profiles/${userId}`,
    UPLOAD_PROFILE_IMAGE: (userId) => `${BASE_URL}/profiles/${userId}/upload-image`,
};