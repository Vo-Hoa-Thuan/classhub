import { useState, useEffect } from 'react';
import authService from '../services/AuthService';

/**
 * Custom hook để kiểm tra permissions của user hiện tại
 * @param {string|string[]} requiredPermissions - Permission hoặc array permissions cần kiểm tra
 * @param {string} mode - 'all' (cần tất cả) hoặc 'any' (cần ít nhất 1)
 * @returns {object} - { hasPermission, hasRole, user, permissions }
 */
export const usePermissions = (requiredPermissions = null, mode = 'any') => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Lấy user từ localStorage thay vì Redux
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  // Load user permissions từ AuthService
  const loadUserPermissions = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra có token không
      if (!authService.getAccessToken()) {
        setUser(null);
        setPermissions({});
        return;
      }

      // Dùng AuthService để load user từ token
      const userData = await authService.loadUserFromToken();
      
      if (userData) {
        setUser(userData);
        setPermissions(userData.permissions || {});
      } else {
        // Nếu AuthService fail, fallback về localStorage
        const localUser = getUserFromStorage();
        setUser(localUser);
        setPermissions(localUser?.permissions || {});
      }
    } catch (error) {
      console.error('Error loading user permissions:', error);
      // Fallback về localStorage
      const localUser = getUserFromStorage();
      setUser(localUser);
      setPermissions(localUser?.permissions || {});
    } finally {
      setLoading(false);
    }
  };

  // Load permissions khi component mount
  useEffect(() => {
    loadUserPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Kiểm tra có user không
  if (!user && !loading) {
    return {
      hasPermission: false,
      hasRole: false,
      user: null,
      permissions: {},
      loading: false
    };
  }

  // Nếu đang loading, trả về loading state
  if (loading) {
    return {
      hasPermission: false,
      hasRole: false,
      user: null,
      permissions: {},
      loading: true
    };
  }

  // Sử dụng permissions từ API, fallback về logic cũ nếu không có
  const getEffectivePermissions = () => {
    if (permissions && Object.keys(permissions).length > 0) {
      return permissions;
    }
    
    // Fallback: tạo permissions từ role nếu không có permissions chi tiết
    const fallbackPermissions = {};
    
    // Nếu là admin, chỉ có quyền quản lý user và phân quyền
    if (user?.admin) {
      fallbackPermissions.canManageUsers = true;
      fallbackPermissions.canAssignRoles = true;
      fallbackPermissions.canViewAnalytics = true; // Để xem dashboard tổng quan
    } else if (user?.role === 'adminBlogger') {
      // Nếu là blogger, chỉ có quyền blog
      fallbackPermissions.canCreatePosts = true;
      fallbackPermissions.canEditPosts = true;
      fallbackPermissions.canDeletePosts = true;
      fallbackPermissions.canManageTopics = true;
      fallbackPermissions.canApprovePosts = true;
    } else if (user?.role === 'Quản lý sản phẩm' || user?.role === 'productManager') {
      // Nếu là Product Manager, có quyền quản lý sản phẩm và đơn hàng
      fallbackPermissions.canConfirmOrders = true;
      fallbackPermissions.canCancelOrders = true;
      fallbackPermissions.canManageProducts = true;
    }
    
    return fallbackPermissions;
  };

  const effectivePermissions = getEffectivePermissions();

  // Kiểm tra role
  const hasRole = (role) => {
    if (role === 'admin') return user.admin === true;
    if (role === 'adminBlogger') return user.role === 'adminBlogger';
    if (role === 'productManager') return user.role === 'Quản lý sản phẩm' || user.role === 'productManager';
    return false;
  };

  // Kiểm tra permission đơn lẻ
  const checkSinglePermission = (permission) => {
    return effectivePermissions[permission] === true;
  };

  // Kiểm tra permissions
  const hasPermission = () => {
    if (!requiredPermissions) return true;

    const permissionList = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    if (mode === 'all') {
      return permissionList.every(permission => checkSinglePermission(permission));
    } else {
      return permissionList.some(permission => checkSinglePermission(permission));
    }
  };

  // Kiểm tra có phải admin không
  const isAdmin = () => {
    return user.admin === true;
  };

  // Kiểm tra có phải product manager không
  const isProductManager = () => {
    return user.role === 'Quản lý sản phẩm' || user.role === 'productManager';
  };

  // Kiểm tra có phải blogger không
  const isBlogger = () => {
    return user.role === 'adminBlogger';
  };

  // Lấy tất cả permissions của user
  const getAllPermissions = () => {
    return effectivePermissions;
  };

  // Kiểm tra có permission cụ thể không
  const hasSpecificPermission = (permission) => {
    return checkSinglePermission(permission);
  };

  return {
    hasPermission: hasPermission(),
    hasRole: (role) => hasRole(role),
    user,
    permissions: getAllPermissions(),
    loading,
    isAdmin: isAdmin(),
    isProductManager: isProductManager(),
    isBlogger: isBlogger(),
    hasSpecificPermission,
    // Helper methods
    canManageUsers: checkSinglePermission('canManageUsers'),
    canAssignRoles: checkSinglePermission('canAssignRoles'),
    canManageBanners: checkSinglePermission('canManageBanners'),
    canManagePaymentMethods: checkSinglePermission('canManagePaymentMethods'),
    canManageShipping: checkSinglePermission('canManageShipping'),
    canViewAnalytics: checkSinglePermission('canViewAnalytics'),
    canConfirmOrders: checkSinglePermission('canConfirmOrders'),
    canCancelOrders: checkSinglePermission('canCancelOrders'),
    canManageProducts: checkSinglePermission('canManageProducts'),
    canCreatePosts: checkSinglePermission('canCreatePosts'),
    canEditPosts: checkSinglePermission('canEditPosts'),
    canDeletePosts: checkSinglePermission('canDeletePosts'),
    canManageTopics: checkSinglePermission('canManageTopics'),
    canApprovePosts: checkSinglePermission('canApprovePosts')
  };
};

export default usePermissions;
