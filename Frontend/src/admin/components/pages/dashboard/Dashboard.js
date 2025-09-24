import ChartBarOrder from "../../childrencomponents/chart/ChartBarOrder";
import ChartLineDownloaded from "../../childrencomponents/chart/ChartLineDownloaded";
import TotalDashboard from "../../childrencomponents/totaldashboard/TotalDashboard";
import UserTable from "../../childrencomponents/usertable/UserTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function Dashboard() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canViewAnalytics', 'canManageUsers', 'canManageProducts']}
            mode="any"
            customMessage="Bạn cần có quyền xem thống kê, quản lý người dùng, hoặc quản lý sản phẩm để truy cập Dashboard"
        >
            <DefaultLayout>
                <div className="container-fluid pt-4 px-4">
                <TotalDashboard/>
                    <div className="row mt-2 g-4">
                        <div className="col-sm-12 col-xl-6">
                            <div className="bg-table-admin rounded h-100 p-4">
                                <h6 className="mb-4">Thống kế đơn hàng</h6>
                                <ChartBarOrder/>
                            </div>
                        </div>
                        <div className="col-sm-12 col-xl-6">
                            <div className="bg-table-admin rounded h-100 p-4">
                                <h6 className="mb-4">Thống kê lượt tải xuống</h6>
                                <ChartLineDownloaded/>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="bg-table-admin rounded h-100 p-4">
                             <UserTable/>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Dashboard;
