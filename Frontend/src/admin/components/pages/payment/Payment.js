import PaymentTable from "../../childrencomponents/paymenttable/PaymentTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function Payment() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManagePaymentMethods']}
            customMessage="Bạn cần có quyền quản lý phương thức thanh toán để truy cập trang này"
        >
            <DefaultLayout>
                <PaymentTable></PaymentTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Payment;
