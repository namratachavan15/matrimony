// src/Components/Auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../State/UserContext";


const ProtectedRoute = ({ children }) => {
  const { currentUser, loadingUser } = useUserContext();

  if (loadingUser) return <div>Loading...</div>; // wait for user to load

  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
