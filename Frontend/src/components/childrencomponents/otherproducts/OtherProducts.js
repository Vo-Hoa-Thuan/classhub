import { useEffect, useState } from "react";
import Images from "../../../assets/img/Image";
import OtherProductItem from "./OtherProductItem";
import axios from "axios";
import { api } from "../../../api";

function OtherProducts() {
  const [apps,setApps] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  useEffect(()=>{
    axios.get(api +`/product`)
      .then(response => {
        const appList = response.data.filter((item)=> (item.software===true & item.status===true));
        console.log(appList);
          setApps(appList);
      })
      .catch(error => {
      console.log(error);
      });
  },[]);

  const totalPages = Math.ceil(apps.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = apps.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = (e, pageNumber) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };
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
          <div className="other-products mode-bar">
          {/* <!-- ***** Other Start ***** --> */}
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-section">
                <h4><em>Other Related</em> Product</h4>
              </div>
            </div>
            {currentItems && currentItems.map((item)=>(
            <OtherProductItem
            id={item._id}
            img={item.imageUrl}
            name={item.name}
            author='VNSIM'
            star='4.3'
            download={item.purchased}
            ></OtherProductItem>
            ))}
          </div>
          {/* <!-- ***** Other End ***** --> */}
        </div>
        <div className="col-lg-12">
                <ul className="page-numbers">
                  <li onClick={handlePrevPage}><a href="#"><i className="fa fa-angle-double-left"></i></a></li>
                  <li><a href='#blog'>
                  {/* onClick={e => handleClick(e, pageNumber)} */}
                        {pageNum}
                      </a></li>
                  <li onClick={handleNextPage}><a href="#"><i className="fa fa-angle-double-right"></i></a></li>
                </ul>
                <div>
              </div>
            </div>
        </>
     );
}

export default OtherProducts;