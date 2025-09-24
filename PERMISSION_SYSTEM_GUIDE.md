# Hệ Thống Phân Quyền Chi Tiết - ClassHub

## 🎯 Tổng Quan

Hệ thống phân quyền mới được thiết kế để cung cấp kiểm soát chi tiết hơn về quyền truy cập của người dùng trong ứng dụng ClassHub.

## 👥 Các Vai Trò (Roles)

### 1. **User (Người dùng thường)**
- **Mô tả:** Người dùng cơ bản, không có quyền đặc biệt
- **Mặc định:** Tất cả user mới đăng ký

### 2. **Product Manager (Quản lý sản phẩm)**
- **Mô tả:** Quản lý sản phẩm và đơn hàng
- **Quyền:**
  - ✅ Xác nhận đơn hàng (`canConfirmOrders`)
  - ✅ Hủy đơn hàng (`canCancelOrders`)
  - ✅ Quản lý sản phẩm (`canManageProducts`)

### 3. **Blogger (Người viết blog)**
- **Mô tả:** Quản lý nội dung blog và chủ đề
- **Quyền:**
  - ✅ Tạo bài viết (`canCreatePosts`)
  - ✅ Sửa bài viết (`canEditPosts`)
  - ✅ Xóa bài viết (`canDeletePosts`)
  - ✅ Quản lý chủ đề (`canManageTopics`)

### 4. **Admin (Quản trị viên)**
- **Mô tả:** Toàn quyền quản trị hệ thống
- **Quyền:**
  - ✅ Quản lý người dùng (`canManageUsers`)
  - ✅ Phân quyền (`canAssignRoles`)
  - ✅ Quản lý banner (`canManageBanners`)
  - ✅ Quản lý phương thức thanh toán (`canManagePaymentMethods`)
  - ✅ Quản lý vận chuyển (`canManageShipping`)
  - ✅ Xem thống kê (`canViewAnalytics`)
  - ✅ **Tất cả quyền của Product Manager và Blogger**

## 🔧 Cài Đặt và Sử Dụng

### 1. **Migration Dữ Liệu**
```bash
# Chạy migration để cập nhật dữ liệu hiện tại
cd Backend
node scripts/migrateRoles.js
```

### 2. **Tạo Tài Khoản Test**
```bash
# Tạo các tài khoản mẫu để test
cd Backend
node scripts/createTestAccounts.js
```

### 3. **Tài Khoản Test**
- **Admin:** `admin@classhub.com` / `admin123456`
- **Product Manager:** `productmanager@classhub.com` / `pm123456`
- **Blogger:** `blogger@classhub.com` / `blog123456`

## 🛠️ API Endpoints

### **Quản Lý Roles**
```
GET    /classhub/role/roles              # Lấy danh sách roles
GET    /classhub/role/stats              # Thống kê roles
GET    /classhub/role/user/:userId       # Lấy role của user
PUT    /classhub/role/user/:userId/role  # Cập nhật role
PUT    /classhub/role/user/:userId/permissions # Cập nhật permissions
GET    /classhub/role/users/:role        # Lấy users theo role
GET    /classhub/role/check/:permission  # Kiểm tra permission
```

### **Ví Dụ Sử Dụng API**

#### Cập nhật role của user
```javascript
PUT /classhub/role/user/64f1234567890abcdef12345/role
{
  "role": "productManager"
}
```

#### Cập nhật permissions cụ thể
```javascript
PUT /classhub/role/user/64f1234567890abcdef12345/permissions
{
  "permissions": {
    "canConfirmOrders": true,
    "canCancelOrders": true,
    "canManageProducts": false
  }
}
```

## 🔒 Middleware Bảo Mật

### **Kiểm Tra Permission Cụ Thể**
```javascript
// Yêu cầu permission cụ thể
app.get('/api/orders', 
  permissionMiddleware.requirePermission('canConfirmOrders'),
  orderController.getOrders
);
```

### **Kiểm Tra Multiple Permissions**
```javascript
// Yêu cầu tất cả permissions
app.post('/api/orders/confirm',
  permissionMiddleware.requireAllPermissions(['canConfirmOrders', 'canManageProducts']),
  orderController.confirmOrder
);

// Yêu cầu ít nhất một permission
app.get('/api/analytics',
  permissionMiddleware.requireAnyPermission(['canViewAnalytics', 'canManageUsers']),
  analyticsController.getAnalytics
);
```

### **Kiểm Tra Role**
```javascript
// Yêu cầu role cụ thể
app.get('/api/admin/users',
  permissionMiddleware.requireRole('admin'),
  userController.getUsers
);

// Yêu cầu một trong các roles
app.get('/api/content/posts',
  permissionMiddleware.requireAnyRole(['admin', 'blogger']),
  postController.getPosts
);
```

## 🎨 Giao Diện Quản Lý

### **1. Bảng Người Dùng**
- Hiển thị role với badge màu sắc
- Nút "Quản lý quyền" để cập nhật permissions
- Nút "Phân quyền cũ" để tương thích ngược

### **2. Modal Quản Lý Quyền**
- Chọn role từ dropdown
- Checkbox cho từng permission theo nhóm
- Lưu thay đổi và cập nhật real-time

## 📊 Cấu Trúc Dữ Liệu

### **User Model**
```javascript
{
  // Role system
  role: {
    type: String,
    enum: ['user', 'productManager', 'blogger', 'admin'],
    default: 'user'
  },
  
  // Permissions chi tiết
  permissions: {
    // Product Manager permissions
    canConfirmOrders: Boolean,
    canCancelOrders: Boolean,
    canManageProducts: Boolean,
    
    // Blogger permissions
    canCreatePosts: Boolean,
    canEditPosts: Boolean,
    canDeletePosts: Boolean,
    canManageTopics: Boolean,
    
    // Admin permissions
    canManageUsers: Boolean,
    canAssignRoles: Boolean,
    canManageBanners: Boolean,
    canManagePaymentMethods: Boolean,
    canManageShipping: Boolean,
    canViewAnalytics: Boolean
  },
  
  // Legacy fields (tương thích ngược)
  admin: Boolean,
  blogger: Boolean
}
```

## 🚀 Triển Khai

### **1. Backend**
- Cập nhật User model
- Thêm rolePermissionService
- Thêm permissionMiddleware
- Thêm roleController và routes

### **2. Frontend**
- Cập nhật UserTable component
- Thêm PermissionManager component
- Cập nhật ChangeRole component

### **3. Database**
- Chạy migration script
- Tạo test accounts
- Verify data integrity

## 🔍 Testing

### **1. Test Permissions**
```javascript
// Test permission check
const hasPermission = rolePermissionService.hasPermission(user, 'canConfirmOrders');
console.log(hasPermission); // true/false
```

### **2. Test Role Assignment**
```javascript
// Test role assignment
const user = await User.findById(userId);
rolePermissionService.assignPermissionsByRole(user, 'productManager');
await user.save();
```

## 📝 Lưu Ý Quan Trọng

1. **Tương thích ngược:** Hệ thống vẫn hỗ trợ `admin` và `blogger` fields cũ
2. **Security:** Luôn kiểm tra permissions trước khi thực hiện actions
3. **Performance:** Permissions được cache trong JWT token
4. **Scalability:** Dễ dàng thêm roles và permissions mới

## 🆘 Troubleshooting

### **Lỗi thường gặp:**
1. **Permission denied:** Kiểm tra user có đúng permission không
2. **Role not found:** Kiểm tra role có trong enum không
3. **Migration failed:** Kiểm tra kết nối database và dữ liệu

### **Debug:**
```javascript
// Kiểm tra permissions của user
console.log(user.permissions);
console.log(user.role);

// Kiểm tra role permissions
console.log(rolePermissionService.getRolePermissions('admin'));
```

---

**Hệ thống phân quyền mới đã sẵn sàng sử dụng! 🎉**
