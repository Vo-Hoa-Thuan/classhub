import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required, check if user is admin, blogger, or product manager
  if (requireAdmin) {
    const isAdmin = user.admin === true;
    const isBlogger = user.role === 'blogger';
    const isProductManager = user.role === 'productmanager';
    
    if (!isAdmin && !isBlogger && !isProductManager) {
      console.log('ProtectedRoute - User does not have admin/blogger/product manager access');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
