import TopicPosts from "../blogsidebar/TopicPosts";
import '../blogsidebar/BlogSideBar.scss'
import Images from "../../../assets/img/Image";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api} from "../../../api";
function AuthorSideBar() {
  const { id } = useParams();
  const [author, setAuthor] = useState({});
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    axios.get(api +`/blog/${id}`)
      .then(response => {
          console.log(response.data); 
          setAuthor(response.data.authorId);
      })
      .catch(error => {
      console.log(error);
      });
      axios.get(api +'/topic')
      .then(response => {
          console.log(response.data); 
          setTopics(response.data);
      })
      .catch(error => {
      console.log(error);
      });
    },[]);
    return ( 
        <div className="col-lg-4">
            <div className="sidebar">
              <div className="row">
                <div className="col-lg-12">
                  <div className="sidebar-item search">
                    <form id="search_form" name="gs" method="GET" action="#">
                      <input type="text" name="q" className="searchText" placeholder="type to search..." autoComplete="on"/>
                    </form>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="sidebar-item recent-posts">
                    <div className="sidebar-heading">
                      <h4>Tác Giả</h4>
                    </div>
                    <div className="content">
                      <ul>
                        <li><a href="post-details.html">
                        <img src={author.image} alt='Avatar author'/>
                          <h5>{author.fullname}</h5>
                          <span>{author.email}</span>
                        </a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <TopicPosts
                    topic={topics}
                />
              </div>
            </div>
          </div>
     );
}

export default AuthorSideBar;