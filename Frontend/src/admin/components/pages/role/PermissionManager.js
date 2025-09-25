import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { api } from '../../../../api';
import { notifySuccess, notifyError } from '../../../../components/toast/Toast';
import './PermissionManager.scss';

function PermissionManager({ userId, onClose }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('role');
    
    const token = localStorage.getItem('accessToken') || '';
    
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`,
    }), [token]);

    // Định nghĩa các permissions theo nhóm với icon và màu sắc
    const permissionGroups = [
        {
            name: 'Quản Lý Người Dùng',
            icon: '👥',
            color: '#8B5CF6',
            permissions: {
                canManageUsers: { label: 'Quản lý người dùng', icon: '👤', description: 'Xem, thêm, sửa, xóa người dùng' },
                canAssignRoles: { label: 'Phân quyền', icon: '🔐', description: 'Gán vai trò và quyền cho người dùng' }
            }
        },
        {
            name: 'Quản Lý Sản Phẩm & Đơn Hàng',
            icon: '📦',
            color: '#F59E0B',
            permissions: {
                canConfirmOrders: { label: 'Xác nhận đơn hàng', icon: '✅', description: 'Xác nhận đơn hàng mới' },
                canCancelOrders: { label: 'Hủy đơn hàng', icon: '❌', description: 'Hủy đơn hàng' },
                canManageProducts: { label: 'Quản lý sản phẩm', icon: '🛍️', description: 'Thêm, sửa, xóa sản phẩm' }
            }
        },
        {
            name: 'Quản Lý Nội Dung',
            icon: '📝',
            color: '#10B981',
            permissions: {
                canCreatePosts: { label: 'Tạo bài viết', icon: '✍️', description: 'Tạo bài viết mới' },
                canEditPosts: { label: 'Sửa bài viết', icon: '✏️', description: 'Chỉnh sửa bài viết' },
                canDeletePosts: { label: 'Xóa bài viết', icon: '🗑️', description: 'Xóa bài viết' },
                canManageTopics: { label: 'Quản lý chủ đề', icon: '🏷️', description: 'Quản lý các chủ đề bài viết' }
            }
        },
        {
            name: 'Quản Lý Hệ Thống',
            icon: '⚙️',
            color: '#6B7280',
            permissions: {
                canManageBanners: { label: 'Quản lý banner', icon: '🖼️', description: 'Quản lý banner quảng cáo' },
                canManagePaymentMethods: { label: 'Quản lý phương thức thanh toán', icon: '💳', description: 'Cấu hình phương thức thanh toán' },
                canManageShipping: { label: 'Quản lý vận chuyển', icon: '🚚', description: 'Cấu hình phí vận chuyển' },
                canViewAnalytics: { label: 'Xem thống kê', icon: '📊', description: 'Xem báo cáo và thống kê' }
            }
        }
    ];

    // Định nghĩa roles với icon và màu sắc
    const roles = [
        { value: 'user', label: 'Người dùng thường', icon: '👤', color: '#6B7280', description: 'Quyền cơ bản' },
        { value: 'productManager', label: 'Quản lý sản phẩm', icon: '📦', color: '#F59E0B', description: 'Quản lý sản phẩm và đơn hàng' },
        { value: 'blogger', label: 'Người viết blog', icon: '✍️', color: '#2563EB', description: 'Quản lý nội dung' },
        { value: 'admin', label: 'Quản trị viên', icon: '👑', color: '#DC2626', description: 'Toàn quyền hệ thống' }
    ];

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(api + `/role/user/${userId}`, { headers });
            const userData = response.data.data;
            
            setUser(userData);
            setRole(userData.role || 'user');
            setPermissions(userData.permissions || {});
        } catch (error) {
            console.error('Error fetching user data:', error);
            notifyError('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    }, [userId, headers]);

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId, fetchUserData]);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        
        // Tự động cập nhật permissions theo role được chọn
        const newPermissions = {};
        permissionGroups.forEach(group => {
            Object.keys(group.permissions).forEach(permission => {
                // Mặc định là false
                newPermissions[permission] = false;
            });
        });
        
        // Áp dụng permissions mặc định của role
        const roleDefaultPermissions = {
            'user': [],
            'productManager': [
                'canConfirmOrders', 'canManageProducts', 'canCancelOrders'
            ],
            'blogger': [
                'canCreatePosts', 'canEditPosts', 'canDeletePosts', 'canManageTopics'
            ],
            'admin': [
                'canManageUsers', 'canManageBanners', 'canManageShipping', 
                'canAssignRoles', 'canManagePaymentMethods', 'canViewAnalytics',
                'canConfirmOrders', 'canCancelOrders', 'canManageProducts',
                'canCreatePosts', 'canEditPosts', 'canDeletePosts', 'canManageTopics'
            ]
        };
        
        // Áp dụng permissions mặc định của role
        const defaultPermissions = roleDefaultPermissions[newRole] || [];
        defaultPermissions.forEach(permission => {
            if (newPermissions.hasOwnProperty(permission)) {
                newPermissions[permission] = true;
            }
        });
        
        setPermissions(newPermissions);
        notifySuccess(`Đã tự động cấp quyền mặc định cho vai trò ${roles.find(r => r.value === newRole)?.label}`);
    };

    const handlePermissionChange = (permission, value) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: value
        }));
    };

    const applyRolePermissions = () => {
        // Áp dụng permissions mặc định theo role
        const newPermissions = { ...permissions };
        
        // Định nghĩa permissions mặc định cho từng role
        const roleDefaultPermissions = {
            'user': [],
            'productManager': [
                'canConfirmOrders', 'canManageProducts', 'canCancelOrders'
            ],
            'blogger': [
                'canCreatePosts', 'canEditPosts', 'canDeletePosts', 'canManageTopics'
            ],
            'admin': [
                'canManageUsers', 'canManageBanners', 'canManageShipping', 
                'canAssignRoles', 'canManagePaymentMethods', 'canViewAnalytics',
                'canConfirmOrders', 'canCancelOrders', 'canManageProducts',
                'canCreatePosts', 'canEditPosts', 'canDeletePosts', 'canManageTopics'
            ]
        };
        
        // Reset tất cả permissions về false
        Object.keys(newPermissions).forEach(permission => {
            newPermissions[permission] = false;
        });
        
        // Áp dụng permissions mặc định của role
        const defaultPermissions = roleDefaultPermissions[role] || [];
        defaultPermissions.forEach(permission => {
            if (newPermissions.hasOwnProperty(permission)) {
                newPermissions[permission] = true;
            }
        });
        
        setPermissions(newPermissions);
        notifySuccess(`Đã áp dụng quyền mặc định cho vai trò ${roles.find(r => r.value === role)?.label}`);
    };

    const clearAllPermissions = () => {
        const newPermissions = { ...permissions };
        Object.keys(newPermissions).forEach(permission => {
            newPermissions[permission] = false;
        });
        setPermissions(newPermissions);
        notifySuccess('Đã xóa tất cả quyền');
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // Cập nhật role
            await axios.put(api + `/role/user/${userId}/role`, 
                { role }, 
                { headers }
            );
            
            // Cập nhật permissions
            await axios.put(api + `/role/user/${userId}/permissions`, 
                { permissions }, 
                { headers }
            );
            
            notifySuccess('Cập nhật quyền thành công!');
            onClose();
        } catch (error) {
            console.error('Error updating permissions:', error);
            notifyError('Không thể cập nhật quyền');
        } finally {
            setLoading(false);
        }
    };

    const getSelectedRole = () => {
        return roles.find(r => r.value === role) || roles[0];
    };

    const getPermissionStats = () => {
        const totalPermissions = permissionGroups.reduce((total, group) => 
            total + Object.keys(group.permissions).length, 0
        );
        const grantedPermissions = Object.values(permissions).filter(Boolean).length;
        return { total: totalPermissions, granted: grantedPermissions };
    };

    if (loading) {
        return (
            <div className="permission-manager-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="permission-manager-error">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Không tìm thấy thông tin người dùng</h3>
                    <p>Vui lòng thử lại sau</p>
                </div>
            </div>
        );
    }

    const selectedRole = getSelectedRole();
    const stats = getPermissionStats();

    return (
        <div className="permission-manager">
            {/* Header */}
            <div className="permission-header">
                <div className="header-content">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span className="avatar-icon">{selectedRole.icon}</span>
                        </div>
                        <div className="user-details">
                            <h2 className="user-name">{user.fullname}</h2>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                    <div className="permission-stats">
                        <div className="stat-item">
                            <div className="stat-number">{stats.granted}</div>
                            <div className="stat-label">Quyền được cấp</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Tổng quyền</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'role' ? 'active' : ''}`}
                    onClick={() => setActiveTab('role')}
                >
                    <span className="tab-icon">👤</span>
                    Vai Trò
                </button>
                <button 
                    className={`tab-button ${activeTab === 'permissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('permissions')}
                >
                    <span className="tab-icon">🔐</span>
                    Quyền Hạn
                </button>
            </div>

            {/* Content */}
            <div className="permission-content">
                {activeTab === 'role' ? (
                    <div className="role-selection">
                        <div className="section-header">
                            <h3>Chọn Vai Trò</h3>
                            <p>Vai trò sẽ quyết định các quyền cơ bản của người dùng</p>
                        </div>
                        <div className="role-grid">
                            {roles.map((roleOption) => (
                                <div 
                                    key={roleOption.value}
                                    className={`role-card ${role === roleOption.value ? 'selected' : ''}`}
                                    onClick={() => handleRoleChange(roleOption.value)}
                                    style={{ borderColor: role === roleOption.value ? roleOption.color : '#e5e7eb' }}
                                >
                                    <div className="role-icon" style={{ backgroundColor: roleOption.color }}>
                                        {roleOption.icon}
                                    </div>
                                    <div className="role-info">
                                        <h4 className="role-name">{roleOption.label}</h4>
                                        <p className="role-description">{roleOption.description}</p>
                                    </div>
                                    <div className="role-check">
                                        {role === roleOption.value && <span className="check-icon">✓</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="permissions-selection">
                        <div className="section-header">
                            <h3>Quản Lý Quyền Hạn</h3>
                            <p>Chọn các quyền cụ thể cho người dùng</p>
                            <div className="permission-actions">
                                <button 
                                    className="apply-role-permissions-btn"
                                    onClick={applyRolePermissions}
                                    disabled={!role}
                                >
                                    <span className="btn-icon">⚡</span>
                                    Áp dụng quyền mặc định của vai trò
                                </button>
                                <button 
                                    className="clear-permissions-btn"
                                    onClick={clearAllPermissions}
                                >
                                    <span className="btn-icon">🗑️</span>
                                    Xóa tất cả quyền
                                </button>
                            </div>
                        </div>
                        <div className="permissions-grid">
                            {permissionGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className="permission-group">
                                    <div className="group-header" style={{ borderLeftColor: group.color }}>
                                        <span className="group-icon">{group.icon}</span>
                                        <h4 className="group-title">{group.name}</h4>
                                    </div>
                                    <div className="group-permissions">
                                        {Object.entries(group.permissions).map(([permission, permissionInfo]) => (
                                            <div key={permission} className="permission-item">
                                                <div className="permission-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id={permission}
                                                        checked={permissions[permission] || false}
                                                        onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                                    />
                                                    <label htmlFor={permission} className="checkbox-label">
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                                <div className="permission-icon">{permissionInfo.icon}</div>
                                                <div className="permission-content">
                                                    <div className="permission-name">{permissionInfo.label}</div>
                                                    <div className="permission-description">{permissionInfo.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="permission-footer">
                <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={onClose}
                >
                    <span className="btn-icon">✕</span>
                    Hủy
                </button>
                <button 
                    type="button" 
                    className="btn-save" 
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="btn-spinner"></div>
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <span className="btn-icon">💾</span>
                            Lưu thay đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default PermissionManager;
