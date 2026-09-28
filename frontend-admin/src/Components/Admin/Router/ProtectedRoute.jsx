// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../State/UserContext";


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return children;
};

export default ProtectedRoute;
