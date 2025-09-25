import { useEffect, useState } from 'react';
import axios from 'axios';

import './BlogList.scss'
import BlogDetailItem from '../blogdetailcontent/BlogDetailItem';
import {api} from '../../../api';

function BlogList() {
  const [pageNum, setPageNum] = useState(1);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loaders, setLoaders] = useState(false);

  useEffect(() => {
    setLoaders(true);
    axios.get(api+'/blog')
      .then(response => {
        setItems(response.data);
        console.log(response.data);
        setLoaders(false);
      })
      .catch(error => {
        console.log(error);
        setLoaders(false);
      });
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = (e) => {
    e.preventDefault();
    setCurrentPage(prevPage => prevPage <= 1 ? prevPage : prevPage - 1);
    setPageNum(prevPage => prevPage <= 1 ? prevPage : prevPage - 1);
  };
  
  const handleNextPage = (e) => {
    e.preventDefault();
    setCurrentPage(prevPage => prevPage >= totalPages ? prevPage : prevPage + 1);
    setPageNum(prevPage => prevPage >= totalPages ? prevPage : prevPage + 1);
  };
    return ( 
        <>
        {loaders &&
        <div id="js-preloader" class="js-preloader">
            <div class="preloader-inner">
                <span class="dot"></span>
                <div class="dots">
                <span></span>
                <span></span>
                <span></span>
                </div>
            </div>
        </div>
        }
          <div className="col-lg-8">
              <div className="all-blog-posts">
                <div className="row">
                {currentItems.map(item => (  
                  <BlogDetailItem
                    key={item._id}
                    id={item._id}
                    topic={item.topic ? item.topic.title : null}
                    title={item.title}
                    author={item.authorId ? item.authorId.fullname : 'Unknown Author'}
                    dateCreate={item.createdAt}
                    shortDesc={item.shortDesc}
                    image={item.imageUrl}
                  />
                ))}
                  <div className="col-lg-12">
                    <ul className="page-numbers">
                      <li onClick={handlePrevPage}><a href="#blog"><i className="fa fa-angle-double-left"></i></a></li>
                      <li><a href='#blog'>
                      {/* onClick={e => handleClick(e, pageNumber)} */}
                            {pageNum}
                          </a></li>
                      <li onClick={handleNextPage}><a href="#blog"><i className="fa fa-angle-double-right"></i></a></li>
                    </ul>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
     );
}

export default BlogList;
