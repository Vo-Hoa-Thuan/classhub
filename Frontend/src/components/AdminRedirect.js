import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Check if user is admin, blogger, or product manager
      const isAdmin = user.admin === true;
      const isBlogger = user.role === 'blogger' || user.role === 'Blogger' || user.blogger === true;
      const isProductManager = user.role === 'productmanager' || user.role === 'productManager' || user.role === 'Quản lý sản phẩm';
      
      // Chỉ redirect nếu đang ở trang chính và chưa có redirect flag trong session
      if ((isAdmin || isBlogger || isProductManager) && location.pathname === '/') {
        const hasRedirected = sessionStorage.getItem('adminRedirected');
        if (!hasRedirected) {
          console.log('AdminRedirect - User is admin/blogger/product manager, redirecting to admin dashboard');
          console.log('User role:', user.role, 'Admin status:', user.admin);
          sessionStorage.setItem('adminRedirected', 'true');
          navigate('/admin/dashboard');
        }
      }
    }
  }, [user, loading, navigate, location.pathname]);

  // Show loading while checking
  if (loading) {
    return <div>Loading...</div>;
  }

  // Component này chỉ xử lý redirect, không render gì
  return null;
};

export default AdminRedirect;
