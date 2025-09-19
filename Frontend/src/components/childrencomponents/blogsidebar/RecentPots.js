import { Link } from "react-router-dom";

function RecentPost({items}) {
    return ( 
        <div className="col-lg-12">
            <div className="sidebar-item recent-posts">
            <div className="sidebar-heading">
                <h4 className="title">Bài Viết Gần Đây</h4>
            </div>
            <div className="content">
                <ul>
                {items && items.map((item)=>(
                <li><Link to={`/blog-detail/${item._id}`}>
                    <h5 className="title">{item.title}</h5>
                    <span>{item.createdAt}</span>
                </Link></li>
                ))}
                </ul>
            </div>
            </div>
        </div>
     );
}

export default RecentPost;