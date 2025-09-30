import { useEffect, useState } from 'react';
import BlogService from '../../../services/BlogService';

import './BlogList.scss'
import BlogDetailItem from '../blogdetailcontent/BlogDetailItem';

function BlogList() {
  const [pageNum, setPageNum] = useState(1);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loaders, setLoaders] = useState(false);

  useEffect(() => {
    loadApprovedBlogs();
  }, []);

  const loadApprovedBlogs = async () => {
    try {
      setLoaders(true);
      const response = await BlogService.getApprovedBlogs();
      if (response.success) {
        setItems(response.data);
        console.log('Approved blogs:', response.data);
      } else {
        console.error('Error loading blogs:', response.message);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoaders(false);
    }
  };

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
        {loaders && (
        <div id="js-preloader" className="js-preloader">
            <div className="preloader-inner">
                <span className="dot"></span>
                <div className="dots">
                <span></span>
                <span></span>
                <span></span>
                </div>
            </div>
        </div>
        )}
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
