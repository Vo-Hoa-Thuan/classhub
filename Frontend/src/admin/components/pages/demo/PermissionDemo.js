import React from 'react';
import DefaultLayout from '../../layout/default/DefaultLayout';
import { usePermissions } from '../../../../hooks/usePermissions';
import AccessDenied from '../../common/AccessDenied';

function PermissionDemo() {
    const {
        user,
        permissions,
        isAdmin,
        isProductManager,
        isBlogger,
        canManageProducts,
        canCreatePosts,
        canManageUsers
    } = usePermissions();

    return (
        <DefaultLayout>
            <div className="container-fluid pt-4 px-4">
                <div className="bg-table-admin rounded h-100 p-4">
                    <h4 className="mb-4">🔐 Demo Hệ Thống Phân Quyền</h4>
                    
                    {/* User Info */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>👤 Thông Tin User</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                                    <p><strong>Role:</strong> 
                                        <span className={`badge ms-2 ${
                                            user?.admin ? 'bg-danger' :
                                            user?.blogger ? 'bg-info' :
                                            user?.role === 'Quản lý sản phẩm' ? 'bg-warning' :
                                            'bg-secondary'
                                        }`}>
                                            {user?.admin ? 'Admin' : 
                                             user?.blogger ? 'Blogger' : 
                                             user?.role === 'Quản lý sản phẩm' ? 'Quản lý sản phẩm' :
                                             'User'}
                                        </span>
                                    </p>
                                    <p><strong>Full Name:</strong> {user?.fullname || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5>🎭 Role Status</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Is Admin:</strong> 
                                        <span className={`badge ms-2 ${isAdmin ? 'bg-success' : 'bg-secondary'}`}>
                                            {isAdmin ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                    <p><strong>Is Product Manager:</strong> 
                                        <span className={`badge ms-2 ${isProductManager ? 'bg-success' : 'bg-secondary'}`}>
                                            {isProductManager ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                    <p><strong>Is Blogger:</strong> 
                                        <span className={`badge ms-2 ${isBlogger ? 'bg-success' : 'bg-secondary'}`}>
                                            {isBlogger ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Grid */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>🔑 Permissions Chi Tiết</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {Object.entries(permissions).map(([key, value]) => (
                                            <div key={key} className="col-md-4 col-sm-6 mb-2">
                                                <div className={`d-flex align-items-center p-2 rounded ${
                                                    value ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                                                }`}>
                                                    <span className={`badge me-2 ${value ? 'bg-success' : 'bg-danger'}`}>
                                                        {value ? '✓' : '✗'}
                                                    </span>
                                                    <small className="text-muted">{key}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permission Tests */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>🧪 Test Permissions</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <h6>Quản Lý Sản Phẩm</h6>
                                            {canManageProducts ? (
                                                <div className="alert alert-success">
                                                    ✅ Có quyền quản lý sản phẩm
                                                </div>
                                            ) : (
                                                <div className="alert alert-danger">
                                                    ❌ Không có quyền quản lý sản phẩm
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-4">
                                            <h6>Tạo Bài Viết</h6>
                                            {canCreatePosts ? (
                                                <div className="alert alert-success">
                                                    ✅ Có quyền tạo bài viết
                                                </div>
                                            ) : (
                                                <div className="alert alert-danger">
                                                    ❌ Không có quyền tạo bài viết
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-4">
                                            <h6>Quản Lý Người Dùng</h6>
                                            {canManageUsers ? (
                                                <div className="alert alert-success">
                                                    ✅ Có quyền quản lý người dùng
                                                </div>
                                            ) : (
                                                <div className="alert alert-danger">
                                                    ❌ Không có quyền quản lý người dùng
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Access Denied Demo */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>🚫 Demo Access Denied</h5>
                                </div>
                                <div className="card-body">
                                    <p>Nếu bạn không có quyền truy cập một trang, sẽ hiển thị thông báo như sau:</p>
                                    
                                    {/* Demo Access Denied cho permission không có */}
                                    {!canManageProducts && (
                                        <div className="border rounded p-3 bg-light">
                                            <AccessDenied 
                                                requiredPermission="canManageProducts"
                                                customMessage="Demo: Bạn cần có quyền quản lý sản phẩm để truy cập trang này"
                                            />
                                        </div>
                                    )}
                                    
                                    {canManageProducts && (
                                        <div className="alert alert-info">
                                            <strong>Lưu ý:</strong> Bạn đã có quyền quản lý sản phẩm nên không thấy AccessDenied component.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default PermissionDemo;
