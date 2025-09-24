import ShippingCompanyTable from "../../childrencomponents/shippingcompanytable/ShippingCompanyTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function ShippingCompany() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageShipping']}
            customMessage="Bạn cần có quyền quản lý vận chuyển để truy cập trang này"
        >
            <DefaultLayout>
                <ShippingCompanyTable></ShippingCompanyTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default ShippingCompany;
