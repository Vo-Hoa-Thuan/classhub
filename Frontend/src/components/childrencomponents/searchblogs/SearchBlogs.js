import { useState } from 'react';
import BlogDetailItem from '../blogdetailcontent/BlogDetailItem';

function SearchBlogs({keyword,data}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [pageNum, setPageNum] = useState(1);

      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(data.length / itemsPerPage);
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
<div className="col-md-9 container-search-result">
    <div className="heading-filter">
        <h4>Kết quả tìm kiếm của "{keyword}"</h4>
    </div>
    <div className="padding"></div>
    <div className="row">

    <div className="col-sm-6">
    <div className="btn-group">
    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
    Sắp xếp theo <span className="caret"></span>
    </button>
    <ul className="dropdown-menu" role="menu">
    <li><a href="#">Name</a></li>
    <li><a href="#">Date</a></li>
    <li><a href="#">View</a></li>
    <li><a href="#">Rating</a></li>
    </ul>
    </div>
    </div>
    </div>
            <div className="row most-popular mode-bar">
                {currentItems && currentItems.map((item) => (
                <BlogDetailItem
                  key={item._id}
                  topic={item.topic}
                  title={item.title}
                  author='Nguyễn Tiến Dũng'
                  dateCreate={item.createdAt}
                  shortDesc={item.shortDesc}
                  image={item.imageUrl}
                />
                ))}
                <div className="col-lg-12">
                    <div className="main-button">
                        <a onClick={handlePrevPage} href="#product"><i className="fa fa-angle-double-left"></i></a>
                        <a href="#product">{pageNum}</a>
                        <a onClick={handleNextPage} href="#product"><i className="fa fa-angle-double-right"></i></a>
                    </div>
                </div>
            </div>
    </div>
</>
     );
}

export default SearchBlogs;