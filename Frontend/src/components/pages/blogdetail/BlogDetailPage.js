import AuthorSideBar from "../../childrencomponents/authorsidebar/AuthorSideBar";
import BlogDetailContent from "../../childrencomponents/blogdetailcontent/BlogDetailContent";
import CommentsPost from "../../childrencomponents/commentspost/CommentsPost";
import Default from "../../layout/default/Default";

function BlogDetailPage({id}) {
    return ( 
        <Default>
        <div className="row">
            <BlogDetailContent/>
            <AuthorSideBar/>
        </div>
        <CommentsPost/>
        </Default>
     );
}

export default BlogDetailPage;