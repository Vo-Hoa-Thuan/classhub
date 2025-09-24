import React from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import AccessDenied from './AccessDenied';

/**
 * Component bảo vệ routes dựa trên permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con cần bảo vệ
 * @param {string|string[]} props.requiredPermissions - Permission(s) cần thiết
 * @param {string} props.requiredRole - Role cần thiết
 * @param {string} props.mode - 'all' (cần tất cả) hoặc 'any' (cần ít nhất 1)
 * @param {React.ReactNode} props.fallback - Component hiển thị khi không có quyền
 * @param {boolean} props.showAccessDenied - Có hiển thị AccessDenied component không
 * @param {string} props.customMessage - Thông báo tùy chỉnh
 */
const PermissionGuard = ({
  children,
  requiredPermissions = null,
  requiredRole = null,
  mode = 'any',
  fallback = null,
  showAccessDenied = true,
  customMessage = null
}) => {
  const {
    hasPermission,
    hasRole,
    user,
    isAdmin,
    isProductManager,
    isBlogger
  } = usePermissions(requiredPermissions, mode);

  // Nếu không có user, hiển thị loading hoặc redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Admin, Product Manager và Blogger có quyền vào admin
  if (isAdmin || isProductManager || isBlogger) {
    return <>{children}</>;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return fallback;
    if (showAccessDenied) {
      return (
        <AccessDenied 
          requiredRole={requiredRole}
          customMessage={customMessage}
        />
      );
    }
    return null;
  }

  // Kiểm tra permissions nếu có yêu cầu
  if (requiredPermissions && !hasPermission) {
    if (fallback) return fallback;
    if (showAccessDenied) {
      return (
        <AccessDenied 
          requiredPermission={requiredPermissions}
          customMessage={customMessage}
        />
      );
    }
    return null;
  }

  // Có quyền, hiển thị children
  return <>{children}</>;
};

// Higher-order component để wrap components
export const withPermission = (
  WrappedComponent,
  permissionConfig = {}
) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard {...permissionConfig}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
};

// Hook để sử dụng trong functional components
export const usePermissionGuard = (requiredPermissions, requiredRole, mode = 'any') => {
  const {
    hasPermission,
    hasRole,
    user,
    isAdmin,
    isProductManager
  } = usePermissions(requiredPermissions, mode);

  const hasAccess = () => {
    // Admin và Product Manager có quyền vào admin
    if (isAdmin || isProductManager) return true;

    // Kiểm tra role
    if (requiredRole && !hasRole(requiredRole)) return false;

    // Kiểm tra permissions
    if (requiredPermissions && !hasPermission) return false;

    return true;
  };

  return {
    hasAccess: hasAccess(),
    user,
    isAdmin,
    hasPermission,
    hasRole
  };
};

export default PermissionGuard;
