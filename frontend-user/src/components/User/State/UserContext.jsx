// src/Components/Admin/State/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { api } from "../Config/api";


const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ============================
  // helper to load full user by id (including upass)
  // ============================
  const loadFullUserById = async (id) => {
    try {
      const res = await api.get(`/api/admin/user/${id}`);
      return res.data;            // this should contain upass from DB
    } catch (err) {
      console.error("Failed to load full user from backend", err);
      return null;
    }
  };

  // 🔹 Load logged-in user from localStorage on app start
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          loadFullUserById(parsed.id).then((fullUser) => {
            if (fullUser) {
              setCurrentUser(fullUser);
              localStorage.setItem("user", JSON.stringify(fullUser));
            } else {
              setCurrentUser(parsed);
            }
            setLoadingUser(false);
          });
        } else {
          setCurrentUser(parsed);
          setLoadingUser(false);
        }
      } catch (e) {
        console.error("Invalid user JSON in localStorage", e);
        setLoadingUser(false);
      }
    } else {
      setLoadingUser(false);
    }
  }, []);


  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error("Error in register", err);
      throw err;
    }
  };
  
  const changePassword = async ({ oldPassword, newPassword }) => {
    if (!currentUser || !currentUser.id) {
      throw new Error("User not logged in.");
    }

    const payload = {
      oldPassword,
      newPassword,
    };

    // Using `api` so baseURL is respected
    const res = await api.post(
      `/api/admin/user/${currentUser.id}/change-password`,
      payload
    );

    return res.data; // "Password changed successfully." or similar
  };
  
  
  // ============================
  // AUTH: LOGIN + LOGOUT
  // ============================
  const login = async ({ umobile, upass, urole }) => {
    const payload = {
      umobile: umobile.trim(),
      upass: upass.trim(),
      urole: urole,
    };

    const res = await axios.post("http://localhost:5454/api/auth/login", payload);
    const data = res.data; // { user: {...}, token: "...", ... }

    if (!data.user) {
      throw new Error("Invalid credentials.");
    }

    // Store the JWT first so any authenticated calls below (loadFullUserById)
    // already carry it via the api.jsx interceptor.
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    const loggedUser = data.user;

    // 🔸 NOW: load full user from admin API (this returns entity with upass)
    let fullUser = loggedUser;
    if (loggedUser.id) {
      const backendUser = await loadFullUserById(loggedUser.id);
      if (backendUser) {
        fullUser = backendUser;
      }
    }

    localStorage.setItem("user", JSON.stringify(fullUser));
    setCurrentUser(fullUser);

    return fullUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // ============================
  // USER CRUD
  // ============================
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
    // fetchUsers requires an authenticated request now that /api/admin/user
    // is behind JWT auth. Wait until the initial localStorage/token restore
    // (loadingUser) has finished, and re-run whenever the logged-in user
    // changes (covers both "app just opened with a saved session" and
    // "user just logged in").
    if (!loadingUser) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingUser, currentUser]);

  const createUser = async (user) => {
    try {
      const dataToSend = new FormData();
      const { uprofile, aadharBackPhoto, aadharFrontPhoto, ...rest } = user;

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

      // 🔴 IMPORTANT: ensure upass is not null here
      // if somehow missing, try to get from currentUser
      if (!rest.upass && currentUser && currentUser.upass) {
        rest.upass = currentUser.upass;
      }

      dataToSend.append("user", JSON.stringify(rest));

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

      // if this is the logged-in user, refresh currentUser + localStorage
      if (currentUser && currentUser.id === id) {
        setCurrentUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    let id = isNaN(query) ? 0 : parseInt(query);
    // Switched from raw fetch() to the authenticated `api` client so the
    // JWT is attached (this endpoint is behind auth now).
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

  const incrementViewCount = async (profileId) => {
    if (!currentUser || !currentUser.id) return null;
    try {
      // Viewer identity is now always resolved server-side from the JWT
      // (see AuthUtil.currentUserId() in UserController), so we no longer
      // send viewerId from the client.
      const res = await api.post(`/api/users/${profileId}/increment-view`);
      return res.data; // updated user
    } catch (err) {
      console.error("Error incrementing view:", err);
      return null;
    }
  };
  
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        loadingUser,
        login,
        logout,
        users,
        loading,
        editingUser,
        setEditingUser,
        createUser,
        incrementViewCount,
        updateUser,
        searchUsers,
        deleteUser,
        register,
        changePassword
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
