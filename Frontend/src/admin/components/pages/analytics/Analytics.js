import TotalDashboard from "../../childrencomponents/totaldashboard/TotalDashboard";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function Analytics() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canViewAnalytics']}
            mode="any"
            customMessage="Bạn cần có quyền xem thống kê để truy cập Analytics"
        >
            <DefaultLayout>
                <div className="container-fluid pt-4 px-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-table-admin rounded h-100 p-4">
                                <h4 className="mb-4">Thống kê tổng quan</h4>
                                <TotalDashboard/>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Analytics;
