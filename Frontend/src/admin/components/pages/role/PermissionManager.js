import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../../../../api';
import Toast, { notifySuccess, notifyError } from '../../../../components/toast/Toast';

function PermissionManager({ userId, onClose }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(false);
    
    const [token, setToken] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
    });
    
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    // Định nghĩa các permissions theo nhóm
    const permissionGroups = {
        'Product Manager': {
            canConfirmOrders: 'Xác nhận đơn hàng',
            canCancelOrders: 'Hủy đơn hàng',
            canManageProducts: 'Quản lý sản phẩm'
        },
        'Blogger': {
            canCreatePosts: 'Tạo bài viết',
            canEditPosts: 'Sửa bài viết',
            canDeletePosts: 'Xóa bài viết',
            canManageTopics: 'Quản lý chủ đề'
        },
        'Admin': {
            canManageUsers: 'Quản lý người dùng',
            canAssignRoles: 'Phân quyền',
            canManageBanners: 'Quản lý banner',
            canManagePaymentMethods: 'Quản lý phương thức thanh toán',
            canManageShipping: 'Quản lý vận chuyển',
            canViewAnalytics: 'Xem thống kê'
        }
    };

    // Định nghĩa roles
    const roles = [
        { value: 'user', label: 'Người dùng thường' },
        { value: 'productManager', label: 'Quản lý sản phẩm' },
        { value: 'blogger', label: 'Người viết blog' },
        { value: 'admin', label: 'Quản trị viên' }
    ];

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(api + `/user/${userId}`, { headers });
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
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        
        // Reset permissions khi đổi role
        const newPermissions = {};
        Object.values(permissionGroups).forEach(group => {
            Object.keys(group).forEach(permission => {
                newPermissions[permission] = false;
            });
        });
        
        setPermissions(newPermissions);
    };

    const handlePermissionChange = (permission, value) => {
        setPermissions(prev => ({
            ...prev,
            [permission]: value
        }));
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="alert alert-danger">
                Không tìm thấy thông tin người dùng
            </div>
        );
    }

    return (
        <div className="permission-manager">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Quản lý quyền: {user.fullname}</h5>
                    <small className="text-muted">{user.email}</small>
                </div>
                
                <div className="card-body">
                    {/* Role Selection */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Vai trò:</label>
                        <select 
                            className="form-select" 
                            value={role} 
                            onChange={(e) => handleRoleChange(e.target.value)}
                        >
                            {roles.map(roleOption => (
                                <option key={roleOption.value} value={roleOption.value}>
                                    {roleOption.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Permissions by Group */}
                    {Object.entries(permissionGroups).map(([groupName, groupPermissions]) => (
                        <div key={groupName} className="mb-4">
                            <h6 className="text-primary">{groupName}</h6>
                            <div className="row">
                                {Object.entries(groupPermissions).map(([permission, label]) => (
                                    <div key={permission} className="col-md-6 mb-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={permission}
                                                checked={permissions[permission] || false}
                                                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor={permission}>
                                                {label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-footer">
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PermissionManager;
