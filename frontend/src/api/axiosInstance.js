import axios from "axios";

/**
 * Simple Axios instance pointing to the Spring Boot backend.
 * No JWT interceptors needed for now.
 */
const api = axios.create({
  baseURL: "http://localhost:8083",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
