import { useParams } from 'react-router-dom';
import Images from '../../../assets/img/Image';
import '../bloglist/BlogList.scss'
import '../blogsidebar/BlogSideBar.scss'
import BlogDetailItem from './BlogDetailItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api} from '../../../api';

function BlogDetailContent() {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  const [token,setToken] = useState(() => {
    const data = localStorage.getItem('accessToken');
    return data ? data : '';
  });
  const headers = {
    Authorization: `Bearer ${token}`,
    };
  useEffect(() => {
    // Chỉ lấy bài viết đã được duyệt cho trang blog công khai
    axios.get(api +`/blog/${id}`)
      .then(response => {
          console.log(response.data); 
          setBlog(response.data);
      })
      .catch(error => {
        console.log(error);
        if (error.response?.status === 404) {
          setBlog(null); 
        }
      });
    },[id]);
    
    if (!blog) {
      return (
        <div className="col-lg-8">
          <div className="all-blog-posts">
            <div className="row">
              <div className="col-12">
                <div className="blog-post">
                  <div className="text-center py-5">
                    <h3>Bài viết không tồn tại hoặc chưa được duyệt</h3>
                    <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc chưa được duyệt bởi quản trị viên.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return ( 
        <div className="col-lg-8">
            <div className="all-blog-posts">
              <div className="row">
                <BlogDetailItem
                id={blog._id}
                image={blog.imageUrl}
                topic={blog.topic ? blog.topic.title : null}
                title={blog.title}
                author={blog.authorId ? blog.authorId.fullname : null}
                dateCreate={blog.createdAt}
                shortDesc={blog.shortDesc}
                comments='12'
                desc={blog.desc}
                />
              </div>
            </div>
          </div>
     );
}

export default BlogDetailContent;
