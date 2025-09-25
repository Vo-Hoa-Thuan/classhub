import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Check if user is admin, blogger, or product manager
      const isAdmin = user.admin === true;
      const isBlogger = user.role === 'blogger';
      const isProductManager = user.role === 'productmanager';
      
      if (isAdmin || isBlogger || isProductManager) {
        console.log('AdminRedirect - User is admin/blogger/product manager, redirecting to dashboard');
        console.log('User role:', user.role, 'Admin status:', user.admin);
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('AdminRedirect - User is not admin/blogger/product manager, staying on home page');
      }
    }
  }, [user, loading, navigate]);

  // Show loading while checking
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is admin, they will be redirected
  // If not admin, show normal home page
  return null;
};

export default AdminRedirect;
