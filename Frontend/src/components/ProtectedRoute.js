import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false, requirePermission = null }) => {
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
    const isAdmin = user.admin === true || user.role === 'admin';
    const isBlogger = user.role === 'adminBlogger';
    const isProductManager = user.role === 'productManager';
    
    if (!isAdmin && !isBlogger && !isProductManager) {
      console.log('ProtectedRoute - User does not have admin/blogger/product manager access');
      console.log('User role:', user.role, 'Admin status:', user.admin);
      return <Navigate to="/" replace />;
    }
  }

  // If specific permission is required, check if user has that permission
  if (requirePermission) {
    const hasPermission = user.permissions?.[requirePermission] === true || user.role === 'admin';
    
    if (!hasPermission) {
      console.log(`ProtectedRoute - User does not have permission: ${requirePermission}`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
