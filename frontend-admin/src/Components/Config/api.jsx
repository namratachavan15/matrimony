import axios from "axios";
export const API_URI = "http://localhost:5454";

export const api = axios.create({
  baseURL: API_URI,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (issued at admin login) to every request automatically, so
// individual pages/components never have to remember to do it themselves.
// Without this, every admin API call goes out unauthenticated and the
// backend correctly rejects it (401/403) -- which is what was happening.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired/invalid, the backend returns 401. Clear
// the stale session so the app can redirect back to the admin login instead
// of silently failing on every request.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);