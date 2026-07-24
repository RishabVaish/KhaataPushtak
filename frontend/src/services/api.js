import axios from "axios";

// A single, pre-configured Axios instance. Every service module in
// this app (created in later phases — authService.js, hisaabService.js)
// will import THIS instance rather than the raw axios package.
// This is the frontend equivalent of the backend's centralized
// error-handling middleware: one place, one behavior, everywhere.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor (prepared, not yet active) ──────────
// Runs before every outgoing request. Once we build authentication
// (Phase 2.2) and store the JWT after login, this will automatically
// attach it as "Authorization: Bearer <token>" — so individual pages
// never need to remember to add the header themselves.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("khaatapushtak_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor (prepared, not yet active) ─────────
// Centralizes what happens when the backend returns an error.
// For now it just passes errors through — in Phase 2.2 we'll extend
// this to auto-logout the user on a 401 (expired/invalid token).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
