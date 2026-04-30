import api from "./axiosInstance";

/**
 * POST /auth/login
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ token: string, role: string, username: string }>}
 */
export const loginApi = (credentials) => api.post("/auth/login", credentials);

/**
 * POST /auth/register
 * Registers the user after OTP is validated by backend.
 * @param {{ username: string, email: string, password: string, role: string, otp: string }} userData
 */
export const registerApi = (userData) => api.post("/auth/register", userData);

/**
 * POST /auth/send-otp
 * Sends OTP to the provided email for registration.
 * @param {{ email: string }} payload
 */
export const sendOtpApi = (payload) => api.post("/auth/send-otp", payload);

/**
 * POST /auth/send-reset-otp
 * Sends OTP for password reset.
 * @param {{ email: string }} payload
 */
export const sendResetOtpApi = (payload) =>
  api.post("/auth/send-reset-otp", payload);

/**
 * POST /auth/reset-password
 * OTP-based password reset.
 * @param {{ email: string, otp: string, newPassword: string }} payload
 * @returns {Promise} 200 OK on success
 */
export const resetPasswordApi = (payload) =>
  api.post("/auth/reset-password", payload);
