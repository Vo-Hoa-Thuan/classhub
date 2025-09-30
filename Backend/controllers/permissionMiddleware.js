const rolePermissionService = require('../services/rolePermissionService');

const permissionMiddleware = {
    // Middleware kiểm tra permission cụ thể
    requirePermission: (permission) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                    });
                }

                if (!rolePermissionService.hasPermission(req.user, permission)) {
                    return res.status(403).json({
                        success: false,
                        message: `Permission '${permission}' required`
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Permission check failed"
                });
            }
        };
    },

    // Middleware kiểm tra multiple permissions (tất cả phải có)
    requireAllPermissions: (permissions) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                    });
                }

                if (!rolePermissionService.hasAllPermissions(req.user, permissions)) {
                    return res.status(403).json({
                        success: false,
                        message: `All permissions required: ${permissions.join(', ')}`
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Permission check failed"
                });
            }
        };
    },

    // Middleware kiểm tra multiple permissions (chỉ cần một)
    requireAnyPermission: (permissions) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                    });
                }

                if (!rolePermissionService.hasAnyPermission(req.user, permissions)) {
                    return res.status(403).json({
                        success: false,
                        message: `At least one permission required: ${permissions.join(', ')}`
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Permission check failed"
                });
            }
        };
    },

    // Middleware kiểm tra role cụ thể
    requireRole: (role) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                    });
                }

                if (req.user.role !== role) {
                    return res.status(403).json({
                        success: false,
                        message: `Role '${role}' required`
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Role check failed"
                });
            }
        };
    },

    // Middleware kiểm tra multiple roles (chỉ cần một)
    requireAnyRole: (roles) => {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required"
                    });
                }

                if (!roles.includes(req.user.role)) {
                    return res.status(403).json({
                        success: false,
                        message: `One of these roles required: ${roles.join(', ')}`
                    });
                }

                next();
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Role check failed"
                });
            }
        };
    },

    // Middleware cho Product Manager permissions
    requireProductManagerPermissions: () => {
        return permissionMiddleware.requireAnyPermission([
            'canConfirmOrders',
            'canCancelOrders', 
            'canManageProducts'
        ]);
    },

    // Middleware cho Blogger permissions
    requireBloggerPermissions: () => {
        return permissionMiddleware.requireAnyPermission([
            'canCreatePosts',
            'canEditPosts',
            'canDeletePosts',
            'canManageTopics',
            'canApprovePosts'
        ]);
    },

    // Middleware cho Admin permissions
    requireAdminPermissions: () => {
        return permissionMiddleware.requireAnyPermission([
            'canManageUsers',
            'canAssignRoles',
            'canManageBanners',
            'canManagePaymentMethods',
            'canManageShipping',
            'canViewAnalytics'
        ]);
    }
};

module.exports = permissionMiddleware;
