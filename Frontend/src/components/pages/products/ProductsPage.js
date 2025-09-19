import Default from "../../layout/default/Default";
import ListProducts from "../../childrencomponents/productcomponents/listproducts/ListProducts";
import BannerApps from '../../childrencomponents/productcomponents/bannerapps/BannerApps'
import './ProductsPage.scss'
import PopularList from "../../childrencomponents/productcomponents/popular/PopularList";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../api";

function ProductsPage() {
  const [appList, setAppList] = useState([]);
  const [appsFeature, setAppFeature] = useState([]);
  const [loaders, setLoaders] =useState(false);

  useEffect(()=>{
    setLoaders(true);
    axios.get(api+'/product')
    .then((response)=>{
        const appList = response.data.filter((app) => app.software === true & app.status === true);
        setAppList(appList);
        let list = [];
        for(var i =0; i < 3; i ++){
        list.push(appList[i]);
        }
        setAppFeature(list);
        setLoaders(false);
    })
    .catch((err)=>{
      console.log(err);
      setLoaders(false);
    });
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
          <BannerApps
            appList={appsFeature}
          />
          <PopularList
            appList={appList}
          />
          <ListProducts/>
        </Default>
     );
}

export default ProductsPage;