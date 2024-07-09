import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // For simplicity, use a dummy authentication check
  // In real-world applications, use proper authentication mechanisms
  return localStorage.getItem('isAuthenticated') === 'true';
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
