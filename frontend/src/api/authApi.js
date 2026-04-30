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
 * Sends OTP to the provided email.
 * @param {{ email: string }} payload
 */
export const sendOtpApi = (payload) => api.post("/auth/send-otp", payload);

/**
 * POST /auth/forgot-password
 * Triggers a password-reset email for the given address.
 * @param {{ email: string }} payload
 * @returns {Promise} 200 OK on success
 */
export const forgotPasswordApi = (payload) =>
  api.post("/auth/forgot-password", payload);

/**
 * POST /auth/reset-password
 * Validates the one-time token and saves the new password.
 * @param {{ token: string, newPassword: string }} payload
 *   token       – the value from ?token=... in the reset URL
 *   newPassword – the user's chosen new password (plain text; backend hashes it)
 * @returns {Promise} 200 OK on success
 */
export const resetPasswordApi = (payload) =>
  api.post("/auth/reset-password", payload);
