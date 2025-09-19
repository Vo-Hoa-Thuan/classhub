import './BlogsPage.scss'
import Default from "../../layout/default/Default";
import BlogList from "../../childrencomponents/bloglist/BlogList";
import BlogSideBar from "../../childrencomponents/blogsidebar/BlogSideBar";

function BlogPage() {
    return (
    <Default>
        <div className="row">
          <BlogList/>
          <BlogSideBar/>
        </div>
    </Default>
    );
}

export default BlogPage;