import BlogTable from "../../childrencomponents/blogtable/BlogTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";
import './Blog.scss';

function Blog() {
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canCreatePosts', 'canEditPosts', 'canDeletePosts']}
            mode="any"
            customMessage="Bạn cần có quyền quản lý bài viết để truy cập trang này"
        >
            <DefaultLayout>
            <BlogTable></BlogTable>
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Blog;
