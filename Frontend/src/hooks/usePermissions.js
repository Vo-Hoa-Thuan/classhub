/**
 * Custom hook để kiểm tra permissions của user hiện tại
 * @param {string|string[]} requiredPermissions - Permission hoặc array permissions cần kiểm tra
 * @param {string} mode - 'all' (cần tất cả) hoặc 'any' (cần ít nhất 1)
 * @returns {object} - { hasPermission, hasRole, user, permissions }
 */
export const usePermissions = (requiredPermissions = null, mode = 'any') => {
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

  const user = getUserFromStorage();

  // Kiểm tra có user không
  if (!user) {
    return {
      hasPermission: false,
      hasRole: false,
      user: null,
      permissions: {}
    };
  }

  // Tạo permissions object dựa trên admin, blogger flags và role
  const createPermissionsFromUser = (user) => {
    const permissions = {};
    
    // Nếu là admin, có tất cả quyền
    if (user.admin) {
      permissions.canManageUsers = true;
      permissions.canAssignRoles = true;
      permissions.canManageBanners = true;
      permissions.canManagePaymentMethods = true;
      permissions.canManageShipping = true;
      permissions.canViewAnalytics = true;
      permissions.canConfirmOrders = true;
      permissions.canCancelOrders = true;
      permissions.canManageProducts = true;
      permissions.canCreatePosts = true;
      permissions.canEditPosts = true;
      permissions.canDeletePosts = true;
      permissions.canManageTopics = true;
    } else if (user.blogger) {
      // Nếu là blogger, chỉ có quyền blog
      permissions.canCreatePosts = true;
      permissions.canEditPosts = true;
      permissions.canDeletePosts = true;
      permissions.canManageTopics = true;
    } else if (user.role === 'Quản lý sản phẩm' || user.role === 'productManager') {
      // Nếu là Product Manager, có quyền quản lý sản phẩm và đơn hàng
      permissions.canConfirmOrders = true;
      permissions.canCancelOrders = true;
      permissions.canManageProducts = true;
    } else {
      // User thường, không có quyền gì
      // Có thể thêm permissions khác nếu cần
    }
    
    return permissions;
  };

  const permissions = createPermissionsFromUser(user);

  // Kiểm tra role
  const hasRole = (role) => {
    if (role === 'admin') return user.admin === true;
    if (role === 'blogger') return user.blogger === true;
    if (role === 'productManager') return user.role === 'Quản lý sản phẩm' || user.role === 'productManager';
    return false;
  };

  // Kiểm tra permission đơn lẻ
  const checkSinglePermission = (permission) => {
    return permissions[permission] === true;
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
    return user.blogger === true;
  };

  // Lấy tất cả permissions của user
  const getAllPermissions = () => {
    return permissions;
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
    canManageTopics: checkSinglePermission('canManageTopics')
  };
};

export default usePermissions;
