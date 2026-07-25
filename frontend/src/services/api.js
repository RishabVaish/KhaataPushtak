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

// ── Request Interceptor ──────────────────────────────────────
// Runs before every outgoing request. Reads the JWT from
// localStorage (written by AuthContext on login/register) and
// attaches it as "Authorization: Bearer <token>" automatically.
// This is the ONLY place the token gets attached — pages and
// components never set this header manually.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("khaatapushtak_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────────
// Runs on every response, success or failure. We specifically watch
// for 401 (Unauthorized) — it means the token is missing, invalid,
// or expired. Rather than each page having to check for this, we
// handle it once, globally: clear the stale session and send the
// user back to /login.
//
// NOTE: This file cannot import AuthContext (that would create a
// circular dependency — AuthContext's provider indirectly depends
// on this file via authService.js). So we clear storage directly
// here instead of calling context's logout(). AuthContext's own
// logout() (used by the Navbar button) is the "normal" path; this
// is just the safety net for an already-expired token.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("khaatapushtak_token");
      localStorage.removeItem("khaatapushtak_user");

      // Avoid redirect loops if we're already ON the login page.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
