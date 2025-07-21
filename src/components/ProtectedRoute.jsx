import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../service/authService';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = authService.getCurrentUserFromLocalStorage() !== null;

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
