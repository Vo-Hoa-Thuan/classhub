import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ 
  requiredPermission = null, 
  requiredRole = null,
  customMessage = null,
  showRetry = true 
}) => {
  const navigate = useNavigate();

  const getPermissionMessage = () => {
    if (customMessage) return customMessage;

    if (requiredRole) {
      return `Bạn cần có quyền ${requiredRole} để truy cập trang này.`;
    }

    if (requiredPermission) {
      const permissionNames = {
        canManageUsers: 'Quản lý người dùng',
        canAssignRoles: 'Phân quyền',
        canManageBanners: 'Quản lý banner',
        canManagePaymentMethods: 'Quản lý phương thức thanh toán',
        canManageShipping: 'Quản lý vận chuyển',
        canViewAnalytics: 'Xem thống kê',
        canConfirmOrders: 'Xác nhận đơn hàng',
        canCancelOrders: 'Hủy đơn hàng',
        canManageProducts: 'Quản lý sản phẩm',
        canCreatePosts: 'Tạo bài viết',
        canEditPosts: 'Sửa bài viết',
        canDeletePosts: 'Xóa bài viết',
        canManageTopics: 'Quản lý chủ đề'
      };

      const permissionName = Array.isArray(requiredPermission) 
        ? requiredPermission.map(p => permissionNames[p] || p).join(', ')
        : permissionNames[requiredPermission] || requiredPermission;

      return `Bạn cần có quyền "${permissionName}" để truy cập trang này.`;
    }

    return 'Bạn không có quyền truy cập trang này.';
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/admin');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fas fa-shield-alt text-4xl text-red-500"></i>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-white text-sm"></i>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Truy Cập Bị Từ Chối
        </h1>

        {/* Message */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-4">
            {getPermissionMessage()}
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-3 flex-shrink-0"></i>
              <div className="text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ quản trị viên để được cấp quyền phù hợp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Quay Lại
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <i className="fas fa-home mr-2"></i>
            Về Trang Chủ Admin
          </button>

          {showRetry && (
            <button
              onClick={handleRefresh}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <i className="fas fa-redo mr-2"></i>
              Thử Lại
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ClassHub Admin Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
