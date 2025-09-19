import { useEffect, useState } from 'react';
import './BlogSideBar.scss'
import RecentPost from './RecentPots';
import TopicPosts from './TopicPosts';
import axios from 'axios';
import { api } from '../../../api';
import { Link } from 'react-router-dom';

function BlogSideBar() {
  const [topics, setTopics] = useState([]);
  const [items, setItems] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{
    axios.get(api +'/topic')
      .then(response => {
          console.log(response.data); 
          setTopics(response.data);
      })
      .catch(error => {
      console.log(error);
      });
    axios.get(api+'/blog')
    .then(response => {
      const sortedBlogs = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      let data = [];
      for(var i = 0; i < 3; i++){
        data.push(sortedBlogs[i]);
      }
      setItems(data);
    })
    .catch(error => {
      console.log(error);
    });
  },[])
    return ( 
        <div className="col-lg-4">
            <div className="sidebar">
              <div className="row">
                <div className="col-lg-12">
                  <div className="sidebar-item search">
                    <form id="search_form" name="gs" method="GET" action="#">
                      <input type="text" name="q" className="searchText" placeholder="type to search..." autoComplete="on"/>
                    </form>
                    {user && user.blogger &&
                        <div className='mt-2'>
                        <Link to='/blog-management' className="btn btn-primary text-white">Quản lý bài viết</Link>
                        </div>
                    }
                  </div>
                </div>
                <RecentPost
                    items={items}
                />
                <TopicPosts
                    topic={topics}
                />
              </div>
            </div>
          </div>
     );
}

export default BlogSideBar;