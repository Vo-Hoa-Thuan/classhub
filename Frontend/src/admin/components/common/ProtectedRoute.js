import React from 'react';
import PermissionGuard from './PermissionGuard';

/**
 * Component bảo vệ admin routes dựa trên permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component cần bảo vệ
 * @param {string|string[]} props.requiredPermissions - Permission(s) cần thiết
 * @param {string} props.requiredRole - Role cần thiết
 * @param {string} props.mode - 'all' (cần tất cả) hoặc 'any' (cần ít nhất 1)
 * @param {string} props.customMessage - Thông báo tùy chỉnh
 */
const ProtectedRoute = ({
  children,
  requiredPermissions = null,
  requiredRole = null,
  mode = 'any',
  customMessage = null
}) => {
  return (
    <PermissionGuard
      requiredPermissions={requiredPermissions}
      requiredRole={requiredRole}
      mode={mode}
      customMessage={customMessage}
    >
      {children}
    </PermissionGuard>
  );
};

export default ProtectedRoute;
