import axios from "axios";
export const API_URI = "http://localhost:5454";

export const api = axios.create({
  baseURL: API_URI,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (issued at login) to every request automatically, so
// individual components/services never have to remember to do it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired/invalid, the backend now returns 401.
// Clear the stale session so the app can redirect the user back to login
// instead of silently failing.
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
