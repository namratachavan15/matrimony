// src/Components/Admin/State/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { api } from "../../Config/api"; // your axios instance

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true); // 🔹 add this
  // 🔹 NEW: logged-in user (admin)
  const [currentUser, setCurrentUser] = useState(null);

  const [profileViews, setProfileViews] = useState([]);

  const fetchProfileViews = async (search = "") => {
    try {
      const res = await api.get(`/api/admin/profile-views?search=${encodeURIComponent(search)}`);
      console.log("API response", res.data); // ✅ add this
      setProfileViews(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("fetchProfileViews error:", e);
      setProfileViews([]);
    }
  };
  

  // Fetch single user by ID
const fetchUserById = async (id) => {
  try {
    const res = await api.get(`/api/admin/user/${id}`);
    return res.data;
  } catch (err) {
    console.error("fetchUserById error:", err);
    return null;
  }
};

// UserContext.jsx
const viewProfileViewers = async (profileId) => {
  try {
    const res = await api.get(`/api/admin/profile-views/${profileId}/viewers`);
    console.log("Viewers:", res.data);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};
const extendUserDate = async (userId) => {
  setLoading(true);
  try {
    const res = await api.put(`/api/users/${userId}/extend-date`);
    // Update user in context
    setUsers((prev) => prev.map(u => u.id === userId ? res.data : u));
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    setLoading(false);
  }
};
// Update star count for a user
const updateStarCount = async (userId, newStarCount) => {
  setLoading(true);
  try {
    // limit value between 0 and 5
    if (newStarCount < 0) newStarCount = 0;
    if (newStarCount > 5) newStarCount = 5;

    const res = await api.put(`/api/admin/user/${userId}/starcount?starCount=${newStarCount}`);

    // Update user in local context
    setUsers(prev => prev.map(u => (u.id === userId ? res.data : u)));
    return res.data;
  } catch (err) {
    console.error("updateStarCount error:", err);
    return null;
  } finally {
    setLoading(false);
  }
};



  // 🔹 Load logged-in user from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid user JSON in localStorage", e);
      }
    }
    setLoadingUser(false); // done loading
  }, []);

  // ============================
  // AUTH: LOGIN + LOGOUT
  // ============================

  // 🔹 Login API (called from Login.jsx)
  const login = async ({ umobile, upass,urole }) => {
    const payload = {
      umobile: umobile.trim(),
      upass: upass.trim(),
      urole:urole
    };

    // you can also use `api` if you configured baseURL there
    const res = await axios.post("http://localhost:5454/api/auth/login", payload);

    const data = res.data; // { message, user, token }

    if (!data.user) {
      throw new Error("Invalid credentials.");
    }
    // store in localStorage + context -- the token is what every subsequent
    // admin API call needs (see Config/api.jsx's request interceptor); it
    // was previously never saved here, so every admin request after login
    // went out unauthenticated.
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    localStorage.setItem("user", JSON.stringify(data.user));
    setCurrentUser(data.user);

    return data.user;
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // ============================
  // EXISTING USER CRUD
  // ============================

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/user");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (user) => {
    try {
      const dataToSend = new FormData();

      const { uprofile, aadharBackPhoto, aadharFrontPhoto, ...rest } = user;

      // JSON for other fields
      dataToSend.append("user", JSON.stringify(rest));

      if (uprofile) dataToSend.append("uprofile", uprofile);
      if (aadharBackPhoto) dataToSend.append("aadharBackPhoto", aadharBackPhoto);
      if (aadharFrontPhoto) dataToSend.append("aadharFrontPhoto", aadharFrontPhoto);

      const res = await api.post("/api/admin/user/create", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUsers((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (id, user) => {
    setLoading(true);
    try {
      const dataToSend = new FormData();

      const { uprofile, aadharBackPhoto, aadharFrontPhoto, ...rest } = user;

      dataToSend.append("user", JSON.stringify(rest));

      // Only append file fields if user selected a new file
      if (uprofile instanceof File) {
        dataToSend.append("uprofile", uprofile);
      }
      if (aadharBackPhoto instanceof File) {
        dataToSend.append("aadharBackPhoto", aadharBackPhoto);
      }
      if (aadharFrontPhoto instanceof File) {
        dataToSend.append("aadharFrontPhoto", aadharFrontPhoto);
      }

      const res = await api.put(`/api/admin/user/${id}`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    let id = isNaN(query) ? 0 : parseInt(query);
    const res = await api.get(
      `/api/admin/user/search?id=${id}&mobile=${query}`
    );
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/admin/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Extend profile view count by 50
  const extendProfileViewCount = async (userId) => {
    setLoading(true);
    try {
      const res = await api.put(`/api/admin/user/${userId}/extend-viewcount`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        // auth
        currentUser,
        login,
        logout,
        fetchUsers,
        extendProfileViewCount,
        fetchProfileViews,
        profileViews,
        viewProfileViewers,
        extendUserDate,
        updateStarCount,
        // user CRUD
        users,
        loading,
        editingUser,
        setEditingUser,
        createUser,
        updateUser,
        searchUsers,
        deleteUser,
        fetchUserById
      }}
    >
      {children}
    </UserContext.Provider>
  );
};