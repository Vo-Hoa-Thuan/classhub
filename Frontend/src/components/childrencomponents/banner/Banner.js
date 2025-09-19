import { Carousel } from 'antd';
import './Banner.scss'
import { Link } from 'react-router-dom';
function Banner({banners}) {
    return (
        
    <Carousel autoplay>
    {banners && banners.map((item)=>(
    <div>
     <div
     style={{backgroundImage: `url(${item.imageUrl})`}} 
     className={`main-banner ${item.offBanner ? 'off-banner' : ''}`} >
         {/* <!-- ***** Banner Start ***** --> */}
             <div className="row" >
               <div className="col-lg-7">
                 <div className="header-text">
                   <h6>{item.desc}</h6>
                   <h4>{item.textHighLight}</h4>
                   <div className="main-button">
                     <Link to={item.linkBanner}>{item.textBtn}</Link>
                   </div>
                 </div>
               </div>
             </div>
             {/* <!-- ***** Banner End ***** -->*/}
           </div>
          </div>
    ))}
  </Carousel>
);
}

export default Banner;
