import BannerTable from "../../childrencomponents/banner/BannerTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";
import './Banner.scss';


function Banner() {
    
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageBanners']}
            customMessage="Bạn cần có quyền quản lý banner để truy cập trang này"
        >
            <DefaultLayout>
            <BannerTable></BannerTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Banner;
