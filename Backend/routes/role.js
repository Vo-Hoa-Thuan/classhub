const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const middlewareControllers = require('../controllers/middlewareControllers');
const permissionMiddleware = require('../controllers/permissionMiddleware');

// Middleware xác thực cho tất cả routes
router.use(middlewareControllers.vertifyToken);

// Public routes - không cần permission đặc biệt
router.get('/roles', roleController.getAllRoles);
router.get('/stats', roleController.getRoleStats);
router.get('/check/:permission', roleController.checkUserPermission);

// Routes cần quyền quản lý users
router.get('/user/:userId', 
    permissionMiddleware.requirePermission('canManageUsers'),
    roleController.getUserRole
);

router.put('/user/:userId/role',
    permissionMiddleware.requirePermission('canAssignRoles'),
    roleController.updateUserRole
);

router.put('/user/:userId/permissions',
    permissionMiddleware.requirePermission('canAssignRoles'),
    roleController.updateUserPermissions
);

router.get('/users/:role',
    permissionMiddleware.requirePermission('canManageUsers'),
    roleController.getUsersByRole
);

module.exports = router;
