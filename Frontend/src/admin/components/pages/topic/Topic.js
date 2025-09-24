import TopicTable from "../../childrencomponents/topictable/TopicTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";

function Topic() {
    
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canManageTopics']}
            customMessage="Bạn cần có quyền quản lý chủ đề để truy cập trang này"
        >
            <DefaultLayout>
            <TopicTable></TopicTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Topic;
