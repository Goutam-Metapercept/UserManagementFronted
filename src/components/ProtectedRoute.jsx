import React from 'react'
import { authService } from '../service/authService'
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({chldren}) => {
  const isAuthenticated = authService.getCurrentUserFromLocalStorage() !== null;
    if (!isAuthenticated) {
        // Redirect to login page if not authenticate 
        return <Navigate to="/login"/> // Prevent rendering the protected component
    }
    return chldren;
        
}

export default ProtectedRoute
