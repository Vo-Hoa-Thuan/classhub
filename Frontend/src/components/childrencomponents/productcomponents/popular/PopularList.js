import React, { useEffect, useState } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import { FreeMode } from 'swiper';
import 'swiper/css'
import 'swiper/css/free-mode'

import PopularItem from './PopularItem';
import Images from '../../../../assets/img/Image.js'
import './PopularList.scss'
import axios from 'axios';
import { api } from '../../../../api';

function PopularList({appList}) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [pageNum, setPageNum] = useState(1);
    
      const totalPages = appList && Math.ceil(appList.length / itemsPerPage);
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
      const currentItems = appList.slice(indexOfFirstItem, indexOfLastItem);
    return ( 
        <div className="most-popular mode-bar">
        {/*<!-- ***** Most Popular Start ***** --> */}
        <div className="row">
          <div className="col-lg-12">
            <div className="heading-section">
              <h4><em>Ứng Dụng</em> Phổ Biến</h4>
            </div>
            <Swiper
            freeMode = {true}
            grabCursor = {true}
            modules = {[FreeMode]}
            breakpoints={{
              0:{
                    slidesPerView: 1,
                    spaceBetween: 10,
                },
                514:{
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                920:{
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                1024:{
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
            }}
            >
            {currentItems && currentItems.map((app, index) => (
            <SwiperSlide key={app._id}>
            <PopularItem
              id={app._id}
              image={app.imageUrl}
              name={app.name}
              price={app.price}
              saleOff={app.saleOff}
              downloaded={app.purchased}
              ></PopularItem>    
            </SwiperSlide>
            ))}
            {/* <SwiperSlide>
            <PopularItem
              title='App Học Tập'
              author='VNSIM'
              star='4.5'
              order='1023'
              image= {Images.appItem}
              software={false}
              ></PopularItem>    
            </SwiperSlide> */}
            </Swiper>

              <div className="col-lg-12">
                <div className="main-button">
                  <a onClick={handlePrevPage} href="#app"><i className="fa fa-angle-double-left"></i></a>
                  <a href="#app">{pageNum}</a>
                  <a onClick={handleNextPage} href="#app"><i className="fa fa-angle-double-right"></i></a>
                </div>
              </div>
          </div>
        </div>
        {/* <!-- ***** Most Popular End ***** -->*/}
      </div>
     );
}

export default PopularList;