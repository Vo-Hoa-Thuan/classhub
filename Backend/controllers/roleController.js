const User = require("../models/User");
const rolePermissionService = require('../services/rolePermissionService');
const permissionMiddleware = require('./permissionMiddleware');

const roleController = {
    // Lấy danh sách tất cả roles và permissions
    getAllRoles: async (req, res) => {
        try {
            const roles = Object.keys(rolePermissionService.rolePermissions);
            const roleDetails = roles.map(role => ({
                role,
                permissions: rolePermissionService.getRolePermissions(role)
            }));

            res.status(200).json({
                success: true,
                data: roleDetails
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get roles",
                error: error.message
            });
        }
    },

    // Lấy thông tin role của user
    getUserRole: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId).select('role permissions admin');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    role: user.role,
                    permissions: user.permissions,
                    admin: user.admin
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get user role",
                error: error.message
            });
        }
    },

    // Cập nhật role của user
    updateUserRole: async (req, res) => {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            console.log('UpdateUserRole - Current user:', req.user);
            console.log('UpdateUserRole - Target userId:', userId);
            console.log('UpdateUserRole - New role:', role);

            // Validate role
            if (!rolePermissionService.isValidRole(role)) {
                console.log('UpdateUserRole - Invalid role:', role);
                return res.status(400).json({
                    success: false,
                    message: "Invalid role"
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Assign permissions based on role
            rolePermissionService.assignPermissionsByRole(user, role);
            
            await user.save();

            res.status(200).json({
                success: true,
                message: "User role updated successfully",
                data: {
                    role: user.role,
                    permissions: user.permissions
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update user role",
                error: error.message
            });
        }
    },

    // Cập nhật permissions cho tất cả users dựa trên role hiện tại
    updateAllUsersPermissions: async (req, res) => {
        try {
            const users = await User.find({});
            let updatedCount = 0;
            
            for (const user of users) {
                if (user.role) {
                    rolePermissionService.assignPermissionsByRole(user, user.role);
                    await user.save();
                    updatedCount++;
                }
            }
            
            res.status(200).json({
                success: true,
                message: `Updated permissions for ${updatedCount} users`,
                data: {
                    updatedCount,
                    totalUsers: users.length
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update user permissions",
                error: error.message
            });
        }
    },

    // Cập nhật permissions cụ thể của user
    updateUserPermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const { permissions } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Update permissions
            Object.keys(permissions).forEach(permission => {
                if (user.permissions && user.permissions.hasOwnProperty(permission)) {
                    user.permissions[permission] = permissions[permission];
                }
            });

            await user.save();

            res.status(200).json({
                success: true,
                message: "User permissions updated successfully",
                data: {
                    permissions: user.permissions
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to update user permissions",
                error: error.message
            });
        }
    },

    // Lấy danh sách users theo role
    getUsersByRole: async (req, res) => {
        try {
            const { role } = req.params;
            
            if (!rolePermissionService.isValidRole(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role"
                });
            }

            const users = await User.find({ role }).select('fullname email phone role permissions admin createdAt');
            
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get users by role",
                error: error.message
            });
        }
    },

    // Kiểm tra permission của user hiện tại
    checkUserPermission: async (req, res) => {
        try {
            const { permission } = req.params;
            const hasPermission = rolePermissionService.hasPermission(req.user, permission);
            
            res.status(200).json({
                success: true,
                data: {
                    hasPermission,
                    userRole: req.user.role,
                    userPermissions: req.user.permissions
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to check permission",
                error: error.message
            });
        }
    },

    // Lấy thống kê roles
    getRoleStats: async (req, res) => {
        try {
            const stats = await User.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const roleStats = {};
            stats.forEach(stat => {
                roleStats[stat._id] = stat.count;
            });

            res.status(200).json({
                success: true,
                data: roleStats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to get role statistics",
                error: error.message
            });
        }
    }
};

module.exports = roleController;
