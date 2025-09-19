import BlogTable from "../../childrencomponents/blogtable/BlogTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import './Blog.scss';

function Blog() {
    return ( 
        <DefaultLayout>
        <BlogTable></BlogTable>
        </DefaultLayout>
     );
}

export default Blog;