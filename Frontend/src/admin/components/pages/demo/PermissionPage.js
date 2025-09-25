import React, { useState } from 'react';
import DefaultLayout from '../../layout/default/DefaultLayout';
import { usePermissions } from '../../../../hooks/usePermissions';
import './PermissionPage.scss';

function PermissionPage() {
    const {
        user,
        loading,
        canManageProducts,
        canCreatePosts,
        canManageUsers,
        canConfirmOrders,
        canCancelOrders,
        canEditPosts,
        canDeletePosts,
        canManageTopics,
        canAssignRoles,
        canManageBanners,
        canManagePaymentMethods,
        canManageShipping,
        canViewAnalytics
    } = usePermissions();

    const [activeTab, setActiveTab] = useState('granted');

    // Định nghĩa các nhóm quyền với mô tả chi tiết và icon
    const permissionGroups = [
        {
            title: "Quản Lý Người Dùng",
            icon: "👥",
            color: "#8B5CF6",
            permissions: [
                { key: 'canManageUsers', name: 'Quản lý người dùng', value: canManageUsers, description: 'Xem, thêm, sửa, xóa người dùng', icon: "👤" },
                { key: 'canAssignRoles', name: 'Phân quyền', value: canAssignRoles, description: 'Gán vai trò và quyền cho người dùng', icon: "🔐" }
            ]
        },
        {
            title: "Quản Lý Sản Phẩm & Đơn Hàng",
            icon: "📦",
            color: "#F59E0B",
            permissions: [
                { key: 'canManageProducts', name: 'Quản lý sản phẩm', value: canManageProducts, description: 'Thêm, sửa, xóa sản phẩm', icon: "🛍️" },
                { key: 'canConfirmOrders', name: 'Xác nhận đơn hàng', value: canConfirmOrders, description: 'Xác nhận đơn hàng mới', icon: "✅" },
                { key: 'canCancelOrders', name: 'Hủy đơn hàng', value: canCancelOrders, description: 'Hủy đơn hàng', icon: "❌" }
            ]
        },
        {
            title: "Quản Lý Nội Dung",
            icon: "📝",
            color: "#10B981",
            permissions: [
                { key: 'canCreatePosts', name: 'Tạo bài viết', value: canCreatePosts, description: 'Tạo bài viết mới', icon: "✍️" },
                { key: 'canEditPosts', name: 'Sửa bài viết', value: canEditPosts, description: 'Chỉnh sửa bài viết', icon: "✏️" },
                { key: 'canDeletePosts', name: 'Xóa bài viết', value: canDeletePosts, description: 'Xóa bài viết', icon: "🗑️" },
                { key: 'canManageTopics', name: 'Quản lý chủ đề', value: canManageTopics, description: 'Quản lý các chủ đề bài viết', icon: "🏷️" }
            ]
        },
        {
            title: "Quản Lý Hệ Thống",
            icon: "⚙️",
            color: "#6B7280",
            permissions: [
                { key: 'canManageBanners', name: 'Quản lý banner', value: canManageBanners, description: 'Quản lý banner quảng cáo', icon: "🖼️" },
                { key: 'canManagePaymentMethods', name: 'Quản lý phương thức thanh toán', value: canManagePaymentMethods, description: 'Cấu hình phương thức thanh toán', icon: "💳" },
                { key: 'canManageShipping', name: 'Quản lý vận chuyển', value: canManageShipping, description: 'Cấu hình phí vận chuyển', icon: "🚚" },
                { key: 'canViewAnalytics', name: 'Xem thống kê', value: canViewAnalytics, description: 'Xem báo cáo và thống kê', icon: "📊" }
            ]
        }
    ];

    // Lấy danh sách quyền có sẵn
    const availablePermissions = permissionGroups.flatMap(group => group.permissions);
    const grantedPermissions = availablePermissions.filter(p => p.value);
    const deniedPermissions = availablePermissions.filter(p => !p.value);

    const getRoleInfo = () => {
        if (user?.admin) return { name: 'Quản trị viên', color: '#DC2626', icon: '👑' };
        if (user?.blogger) return { name: 'Người viết blog', color: '#2563EB', icon: '✍️' };
        if (user?.role === 'Quản lý sản phẩm') return { name: 'Quản lý sản phẩm', color: '#D97706', icon: '📦' };
        return { name: 'Người dùng', color: '#6B7280', icon: '👤' };
    };

    const roleInfo = getRoleInfo();

    // Hiển thị loading state
    if (loading) {
        return (
            <DefaultLayout>
                <div className="permission-page">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải thông tin quyền hạn...</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="permission-page">
                {/* Header Section */}
                <div className="permission-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1 className="page-title">
                                <span className="title-icon">🔐</span>
                                Quyền Truy Cập Của Tôi
                            </h1>
                            <p className="page-subtitle">Xem và quản lý quyền hạn trong hệ thống</p>
                        </div>
                        <div className="header-right">
                            <div className="permission-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{grantedPermissions.length}</div>
                                    <div className="stat-label">Quyền được cấp</div>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <div className="stat-number">{availablePermissions.length}</div>
                                    <div className="stat-label">Tổng quyền</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="user-info-card">
                    <div className="user-avatar">
                        <span className="avatar-icon">{roleInfo.icon}</span>
                    </div>
                    <div className="user-details">
                        <div className="user-name">{user?.fullname || 'N/A'}</div>
                        <div className="user-email">{user?.email || 'N/A'}</div>
                        <div className="user-role" style={{ backgroundColor: roleInfo.color }}>
                            {roleInfo.name}
                        </div>
                    </div>
                    <div className="user-percentage">
                        <div className="percentage-circle">
                            <svg viewBox="0 0 100 100" className="circle-svg">
                                <circle cx="50" cy="50" r="45" className="circle-bg"></circle>
                                <circle 
                                    cx="50" 
                                    cy="50" 
                                    r="45" 
                                    className="circle-progress"
                                    style={{
                                        strokeDasharray: `${2 * Math.PI * 45}`,
                                        strokeDashoffset: `${2 * Math.PI * 45 * (1 - grantedPermissions.length / availablePermissions.length)}`
                                    }}
                                ></circle>
                            </svg>
                            <div className="percentage-text">
                                {Math.round((grantedPermissions.length / availablePermissions.length) * 100)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-button ${activeTab === 'granted' ? 'active' : ''}`}
                        onClick={() => setActiveTab('granted')}
                    >
                        <span className="tab-icon">✅</span>
                        Quyền Được Cấp ({grantedPermissions.length})
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'denied' ? 'active' : ''}`}
                        onClick={() => setActiveTab('denied')}
                    >
                        <span className="tab-icon">❌</span>
                        Quyền Không Được Cấp ({deniedPermissions.length})
                    </button>
                </div>

                {/* Permission Content */}
                <div className="permission-content">
                    {activeTab === 'granted' ? (
                        <div className="permissions-grid">
                            {permissionGroups.map((group, groupIndex) => {
                                const groupPermissions = group.permissions.filter(p => p.value);
                                if (groupPermissions.length === 0) return null;
                                
                                return (
                                    <div key={groupIndex} className="permission-group">
                                        <div className="group-header" style={{ borderLeftColor: group.color }}>
                                            <span className="group-icon">{group.icon}</span>
                                            <h3 className="group-title">{group.title}</h3>
                                            <span className="group-count">{groupPermissions.length}</span>
                                        </div>
                                        <div className="group-permissions">
                                            {groupPermissions.map((permission, index) => (
                                                <div key={index} className="permission-item granted">
                                                    <div className="permission-icon">{permission.icon}</div>
                                                    <div className="permission-content">
                                                        <div className="permission-name">{permission.name}</div>
                                                        <div className="permission-description">{permission.description}</div>
                                                    </div>
                                                    <div className="permission-status">
                                                        <span className="status-icon">✓</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {grantedPermissions.length === 0 && (
                                <div className="empty-state">
                                    <div className="empty-icon">🔒</div>
                                    <h3>Chưa có quyền nào</h3>
                                    <p>Bạn chưa được cấp quyền nào trong hệ thống</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="permissions-grid">
                            {permissionGroups.map((group, groupIndex) => {
                                const groupPermissions = group.permissions.filter(p => !p.value);
                                if (groupPermissions.length === 0) return null;
                                
                                return (
                                    <div key={groupIndex} className="permission-group">
                                        <div className="group-header" style={{ borderLeftColor: group.color }}>
                                            <span className="group-icon">{group.icon}</span>
                                            <h3 className="group-title">{group.title}</h3>
                                            <span className="group-count">{groupPermissions.length}</span>
                                        </div>
                                        <div className="group-permissions">
                                            {groupPermissions.map((permission, index) => (
                                                <div key={index} className="permission-item denied">
                                                    <div className="permission-icon">{permission.icon}</div>
                                                    <div className="permission-content">
                                                        <div className="permission-name">{permission.name}</div>
                                                        <div className="permission-description">{permission.description}</div>
                                                    </div>
                                                    <div className="permission-status">
                                                        <span className="status-icon">✗</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {deniedPermissions.length === 0 && (
                                <div className="empty-state success">
                                    <div className="empty-icon">🎉</div>
                                    <h3>Tuyệt vời!</h3>
                                    <p>Bạn có tất cả quyền trong hệ thống</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="help-section">
                    <div className="help-card">
                        <div className="help-header">
                            <span className="help-icon">ℹ️</span>
                            <h3>Thông Tin Hệ Thống Phân Quyền</h3>
                        </div>
                        <div className="help-content">
                            <div className="help-item">
                                <div className="help-title">🔒 Về Phân Quyền</div>
                                <ul>
                                    <li>Quyền được cấp dựa trên vai trò của bạn</li>
                                    <li>Admin có tất cả quyền trong hệ thống</li>
                                    <li>Product Manager quản lý sản phẩm và đơn hàng</li>
                                    <li>Blogger quản lý nội dung và bài viết</li>
                                </ul>
                            </div>
                            <div className="help-item">
                                <div className="help-title">📞 Hỗ Trợ</div>
                                <p>Nếu bạn cần thêm quyền hoặc có thắc mắc, vui lòng liên hệ quản trị viên.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default PermissionPage;
