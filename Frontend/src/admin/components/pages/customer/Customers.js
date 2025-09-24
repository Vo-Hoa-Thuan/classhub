import CustomerTable from '../../childrencomponents/customertable/CustomerTable';
import DefaultLayout from '../../layout/default/DefaultLayout'
import ProtectedRoute from '../../common/ProtectedRoute';

function Customers() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageUsers']}
            customMessage="Bạn cần có quyền quản lý người dùng để truy cập trang này"
        >
            <DefaultLayout>
            <CustomerTable/>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Customers;
