import UserTable from "../../childrencomponents/usertable/UserTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function Role() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageUsers', 'canAssignRoles']}
            mode="any"
            customMessage="Bạn cần có quyền quản lý người dùng hoặc phân quyền để truy cập trang này"
        >
            <DefaultLayout>
                <UserTable></UserTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Role;
