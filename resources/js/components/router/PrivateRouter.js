import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const { role } = useParams();  // Get the 'role' from the URL parameter
  const userRole = localStorage.getItem('user_role');
  const authToken = localStorage.getItem('auth_token');  // Check if user is authenticated

  // Check if the user is authenticated and the role matches
  const isRoleValid = Array.isArray(roleRequired)
    ? roleRequired.includes(userRole)
    : userRole === roleRequired;

  if (!authToken) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (!isRoleValid) {
    // If the role doesn't match the required role, redirect to an error page or homepage
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated and role is valid, allow access
  return children;
};

export default PrivateRoute;
