import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

import './Product.scss'
import ProductTable from "../../childrencomponents/producttable/ProductTable";
import SoftwareTable from "../../childrencomponents/softwaretable/SoftwareTable";

function Product() {

    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageProducts']}
            customMessage="Bạn cần có quyền quản lý sản phẩm để truy cập trang này"
        >
            <DefaultLayout>
                <ProductTable></ProductTable>
                <SoftwareTable></SoftwareTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Product;
