import { useState } from 'react';
import AppDownloadedItem from './AppDownloadedItem';
import './AppsDownloaded.scss'

function AppsDownloaded({appsDownloaded}) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [pageNum, setPageNum] = useState(1);


  const totalPages = Math.ceil(appsDownloaded.length / itemsPerPage);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appsDownloaded.slice(indexOfFirstItem, indexOfLastItem);

    return ( 
        <div className="app-library mode-bar">
        {/*<!-- ***** app Library Start ***** --> */}
        <div className="col-lg-12">
          <div className="heading-section">
            <h4><em>Ứng Dụng</em> Của Bạn</h4>
          </div>
          {currentItems && currentItems.map((item)=>(
          <AppDownloadedItem
            order={item}
          />
          ))}
        </div>
        <div className="col-lg-12 mt-4">
            <div className="main-button button-page-order">
                <a onClick={handlePrevPage} href="#product"><i className="fa fa-angle-double-left"></i></a>
                <a href="#product">{pageNum}</a>
                <a onClick={handleNextPage} href="#product"><i className="fa fa-angle-double-right"></i></a>
            </div>
        </div>
        {/* <!-- ***** App Library End ***** --> */}
      </div>
    
     );
}

export default AppsDownloaded;