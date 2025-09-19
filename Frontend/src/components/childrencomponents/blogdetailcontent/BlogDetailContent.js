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
    const data = localStorage.getItem('token');
    return data ? data : '';
  });
  const headers = {
    token: `Bearer ${token}`,
    };
  useEffect(() => {
    axios.get(api +`/blog/${id}`,{headers})
      .then(response => {
          console.log(response.data); 
          setBlog(response.data);
      })
      .catch(error => {
      console.log(error);
      });
    },[id]);
    return ( 
        <div className="col-lg-8">
            <div className="all-blog-posts">
              <div className="row">
                <BlogDetailItem
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