import Banner from '../../childrencomponents/banner/Banner';
import PopularList from '../../childrencomponents/productcomponents/popular/PopularList';
import HelpBar from '../../childrencomponents/helpbar/HelpBar';
import Images from '../../../assets/img/Image';
import Default from '../../layout/default/Default';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { api } from '../../../api';

function HomePage() {
  const [topBanner, setTopBanner] = useState([]);
  const [bottomBanner, setBottomBanner] = useState([]);
  const [appList, setAppList] = useState([]);
  const [loaders, setLoaders] =useState(true);

  useEffect(()=>{
    setLoaders(true);
    axios.get(api+'/product')
    .then((response)=>{
        const appList = response.data.filter((app) => app.software === true & app.status === true);
        setAppList(appList);
        setLoaders(false);
    })
    .catch((err)=>{
      console.log(err);
      setLoaders(false);
    })
  },[]);

  useEffect(()=>{
    axios.get(api+'/banner')
    .then((response)=>{
      const banners = response.data;
      setTopBanner(banners.filter((banner) => banner.position === 'Top' & banner.offBanner === false));
      setBottomBanner(banners.filter((banner) => banner.position === 'Bottom'& banner.offBanner === false));
      console.log(topBanner);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[]);
  
    return (
      <Default>
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
          { topBanner &&
            <Banner 
            banners={topBanner}
          ></Banner>
          }
            <HelpBar></HelpBar>
            <PopularList
              appList={appList}
            />
          {bottomBanner &&
            <Banner 
            banners={bottomBanner}
          ></Banner>
          }
      </Default>
    );
}

export default HomePage;