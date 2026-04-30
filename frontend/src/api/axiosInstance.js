import axios from "axios";

/**
 * Shared Axios instance for the Spring Boot backend.
 *
 * Base URL is fixed to the API server.
 * A request interceptor automatically adds JWT from localStorage
 * to authenticated requests.
 */
const api = axios.create({
  baseURL: "http://localhost:8083",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach Authorization header if token exists.
 * token format expected from backend: raw JWT string
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
