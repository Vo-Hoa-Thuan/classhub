# Hướng Dẫn Bảo Vệ Routes Admin - ClassHub

## 🎯 Tổng Quan

Hệ thống bảo vệ routes đã được triển khai để kiểm soát quyền truy cập các trang admin dựa trên permissions của người dùng.

## 🛡️ Các Component Bảo Vệ

### **1. PermissionGuard**
Component chính để bảo vệ routes, kiểm tra permissions trước khi render content.

```jsx
import PermissionGuard from '../../common/PermissionGuard';

<PermissionGuard 
    requiredPermissions={['canManageProducts']}
    customMessage="Bạn cần có quyền quản lý sản phẩm để truy cập trang này"
>
    <YourComponent />
</PermissionGuard>
```

### **2. ProtectedRoute**
Wrapper component đơn giản hơn cho việc bảo vệ routes.

```jsx
import ProtectedRoute from '../../common/ProtectedRoute';

<ProtectedRoute 
    requiredPermissions={['canViewAnalytics', 'canManageUsers']}
    mode="any"
    customMessage="Bạn cần có quyền xem thống kê hoặc quản lý người dùng"
>
    <Dashboard />
</ProtectedRoute>
```

### **3. AccessDenied**
Component hiển thị thông báo khi không có quyền truy cập.

```jsx
import AccessDenied from '../../common/AccessDenied';

<AccessDenied 
    requiredPermission="canManageProducts"
    customMessage="Bạn cần có quyền quản lý sản phẩm"
/>
```

## 🔧 usePermissions Hook

Hook để kiểm tra permissions trong functional components.

```jsx
import { usePermissions } from '../../../hooks/usePermissions';

function MyComponent() {
    const {
        hasPermission,
        canManageProducts,
        canViewAnalytics,
        isAdmin,
        user
    } = usePermissions(['canManageProducts'], 'any');

    if (!hasPermission) {
        return <AccessDenied requiredPermission="canManageProducts" />;
    }

    return <div>Content for users with permission</div>;
}
```

## 📋 Mapping Permissions với Routes

### **Dashboard** (`/admin/dashboard`)
- **Required:** `canViewAnalytics` HOẶC `canManageUsers`
- **Description:** Trang tổng quan với thống kê và quản lý người dùng

### **Sản Phẩm** (`/admin/product`)
- **Required:** `canManageProducts`
- **Description:** Quản lý sản phẩm và phần mềm

### **Blog** (`/admin/blog`)
- **Required:** `canCreatePosts` HOẶC `canEditPosts` HOẶC `canDeletePosts`
- **Description:** Quản lý bài viết blog

### **Topic** (`/admin/topic`)
- **Required:** `canManageTopics`
- **Description:** Quản lý chủ đề blog

### **Orders** (`/admin/orders`)
- **Required:** `canConfirmOrders` HOẶC `canCancelOrders`
- **Description:** Quản lý đơn hàng

### **Banner** (`/admin/banner`)
- **Required:** `canManageBanners`
- **Description:** Quản lý banner quảng cáo

### **Payment** (`/admin/payment`)
- **Required:** `canManagePaymentMethods`
- **Description:** Quản lý phương thức thanh toán

### **Shipping** (`/admin/ship-company`)
- **Required:** `canManageShipping`
- **Description:** Quản lý đơn vị vận chuyển

### **Khách Hàng** (`/admin/customers`)
- **Required:** `canManageUsers`
- **Description:** Quản lý thông tin khách hàng

### **Phân Quyền** (`/admin/role`)
- **Required:** `canManageUsers` HOẶC `canAssignRoles`
- **Description:** Quản lý roles và permissions

## 🎨 Sidebar Menu Protection

Sidebar menu tự động ẩn/hiện các menu items dựa trên permissions:

```jsx
// Chỉ hiển thị nếu có quyền
{(canManageProducts || isAdmin) && (
    <li><Link to='/admin/product'>Sản Phẩm</Link></li>
)}

// Hiển thị submenu items dựa trên permissions cụ thể
{canManageBanners && <li><NavLink to='/admin/banner'>Banners</NavLink></li>}
{canManageShipping && <li><NavLink to='/admin/ship-company'>Đơn vị vận chuyển</NavLink></li>}
```

## 🔒 Các Modes Kiểm Tra

### **1. Mode "any" (Mặc định)**
Cần ít nhất 1 permission trong danh sách:

```jsx
<ProtectedRoute 
    requiredPermissions={['canViewAnalytics', 'canManageUsers']}
    mode="any"
>
    <Dashboard />
</ProtectedRoute>
```

### **2. Mode "all"**
Cần tất cả permissions trong danh sách:

```jsx
<ProtectedRoute 
    requiredPermissions={['canManageProducts', 'canViewAnalytics']}
    mode="all"
>
    <AdvancedDashboard />
</ProtectedRoute>
```

## 🚀 Cách Sử Dụng

### **1. Bảo Vệ Component Mới**

```jsx
import ProtectedRoute from '../../common/ProtectedRoute';

function NewAdminPage() {
    return (
        <ProtectedRoute 
            requiredPermissions={['canManageProducts']}
            customMessage="Bạn cần có quyền quản lý sản phẩm để truy cập trang này"
        >
            <DefaultLayout>
                <YourContent />
            </DefaultLayout>
        </ProtectedRoute>
    );
}
```

### **2. Kiểm Tra Permission Trong Component**

```jsx
import { usePermissions } from '../../../hooks/usePermissions';

function MyComponent() {
    const { canManageProducts, canViewAnalytics } = usePermissions();

    return (
        <div>
            {canManageProducts && (
                <button>Thêm sản phẩm</button>
            )}
            {canViewAnalytics && (
                <div>Thống kê</div>
            )}
        </div>
    );
}
```

### **3. Higher-Order Component**

```jsx
import { withPermission } from '../../common/PermissionGuard';

const ProtectedComponent = withPermission(
    MyComponent,
    {
        requiredPermissions: ['canManageProducts'],
        customMessage: 'Bạn cần có quyền quản lý sản phẩm'
    }
);
```

## 📊 Role-Based Access

### **Admin**
- ✅ Toàn quyền truy cập tất cả routes
- ✅ Không cần kiểm tra permissions

### **Product Manager**
- ✅ Dashboard (nếu có `canViewAnalytics`)
- ✅ Sản Phẩm (`canManageProducts`)
- ✅ Orders (`canConfirmOrders`, `canCancelOrders`)

### **Blogger**
- ✅ Dashboard (nếu có `canViewAnalytics`)
- ✅ Blog (`canCreatePosts`, `canEditPosts`, `canDeletePosts`)
- ✅ Topic (`canManageTopics`)

### **User**
- ❌ Không có quyền truy cập admin routes

## 🎯 Custom Messages

Có thể tùy chỉnh thông báo lỗi cho từng trang:

```jsx
<ProtectedRoute 
    requiredPermissions={['canManageProducts']}
    customMessage="Chỉ Product Manager mới có thể truy cập trang quản lý sản phẩm"
>
    <ProductPage />
</ProtectedRoute>
```

## 🔍 Debug Permissions

Sử dụng hook để debug permissions:

```jsx
function DebugPermissions() {
    const { user, permissions, hasSpecificPermission } = usePermissions();
    
    console.log('User:', user);
    console.log('Permissions:', permissions);
    console.log('Can manage products:', hasSpecificPermission('canManageProducts'));
    
    return <div>Check console for permission details</div>;
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Admin luôn có toàn quyền** - Không cần kiểm tra permissions
2. **Permissions được cache** trong JWT token
3. **Sidebar tự động ẩn** menu items không có quyền
4. **Thông báo lỗi thân thiện** với người dùng
5. **Tương thích ngược** với hệ thống cũ

## 🚀 Triển Khai

Hệ thống đã được triển khai cho tất cả admin routes:

- ✅ Dashboard
- ✅ Sản Phẩm  
- ✅ Blog & Topic
- ✅ Orders
- ✅ Banner, Payment, Shipping
- ✅ Khách Hàng & Phân Quyền
- ✅ Sidebar Menu Protection

**Hệ thống bảo vệ routes đã sẵn sàng sử dụng! 🎉**
