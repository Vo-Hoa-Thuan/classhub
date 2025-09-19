import React, { useEffect, useState } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import { FreeMode } from 'swiper';
import 'swiper/css'
import 'swiper/css/free-mode'
import Images from "../../../../assets/img/Image";

import FeaturedAppItem from './FeaturedAppItem';
import './FeaturedApp.scss' 
import axios from 'axios';
import { api } from '../../../../api';

function FeaturedApp({appList}) {

    return ( 
      <div className="col-lg-8">
            <div className='swiper_apps mode-bar'>
            <div className="heading-section">
              <h4><em>Ứng Dụng</em> Nổi Bật</h4>
            </div>
            <Swiper
            freeMode = {true}
            grabCursor = {true}
            modules = {[FreeMode]}
            breakpoints={{
              0:{
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                480:{
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                720:{
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                990:{
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                1200:{
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            }}
            >
            {appList && appList.map((app, index) => (
                <SwiperSlide key={index}>
                    <FeaturedAppItem
                        id={app._id}
                        image={app.imageUrl}
                        name={app.name}
                        price={app.price}
                        saleOff={app.saleOff}
                        downloaded={app.purchased}
                    />
                </SwiperSlide>
            ))}
            {/* <SwiperSlide>
            <FeaturedAppItem
                image={Images.app}
                name='App hay quá'
                author='VNSIM'
                star='4.5'
                downloaded='1024'
            />    
            </SwiperSlide> */}
            </Swiper> 
            </div>
        </div> 
     );
}

export default FeaturedApp;