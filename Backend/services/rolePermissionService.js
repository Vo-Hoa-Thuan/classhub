const rolePermissionService = {
    // Định nghĩa permissions cho từng role
    rolePermissions: {
        user: {
            // Tất cả user đều có quyền tạo bài viết (nhưng phải chờ duyệt)
            canCreatePosts: true
        },
        
        adminBlogger: {
            // Admin blogger có quyền quản lý blog và duyệt bài
            canCreatePosts: true,
            canEditPosts: true,
            canDeletePosts: true,
            canManageTopics: true,
            canApprovePosts: true
        },
        
        productManager: {
            canConfirmOrders: true,
            canCancelOrders: true,
            canManageProducts: true
        },
        
        admin: {
            canManageUsers: true,
            canAssignRoles: true,
            canManageBanners: true,
            canManagePaymentMethods: true,
            canManageShipping: true,
            canViewAnalytics: true,
            canApprovePosts: true
        }
    },

    // Hàm gán permissions cho user dựa trên role
    assignPermissionsByRole: (user, role) => {
        const permissions = rolePermissionService.rolePermissions[role] || {};
        
        // Cập nhật permissions
        Object.keys(permissions).forEach(permission => {
            if (user.permissions) {
                user.permissions[permission] = permissions[permission];
            }
        });
        
        // Cập nhật role
        user.role = role;
        
        // Cập nhật legacy fields để tương thích ngược
        user.admin = (role === 'admin');
        
        return user;
    },
    
    // Gán quyền tạo bài cho tất cả user (không cần role)
    assignDefaultUserPermissions(user) {
        if (user.permissions) {
            user.permissions.canCreatePosts = true;
        }
        return user;
    },

    // Hàm kiểm tra permission
    hasPermission: (user, permission) => {
        if (!user || !user.permissions) return false;
        
        // Admin có tất cả quyền
        if (user.role === 'admin') return true;
        
        return user.permissions[permission] === true;
    },

    // Hàm kiểm tra multiple permissions (tất cả phải true)
    hasAllPermissions: (user, permissions) => {
        return permissions.every(permission => 
            rolePermissionService.hasPermission(user, permission)
        );
    },

    // Hàm kiểm tra multiple permissions (chỉ cần một true)
    hasAnyPermission: (user, permissions) => {
        return permissions.some(permission => 
            rolePermissionService.hasPermission(user, permission)
        );
    },

    // Hàm lấy danh sách permissions của user
    getUserPermissions: (user) => {
        if (!user || !user.permissions) return [];
        
        return Object.keys(user.permissions).filter(permission => 
            user.permissions[permission] === true
        );
    },

    // Hàm lấy role permissions
    getRolePermissions: (role) => {
        return rolePermissionService.rolePermissions[role] || {};
    },

    // Hàm validate role
    isValidRole: (role) => {
        return ['user', 'adminBlogger', 'productManager', 'admin'].includes(role);
    }
};

module.exports = rolePermissionService;
