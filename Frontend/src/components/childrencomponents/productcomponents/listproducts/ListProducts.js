import { useContext, useEffect, useState } from "react";
import Images from "../../../../assets/img/Image";
import ProductItem from "./ProductItem";
import axios from "axios";
import { api } from "../../../../api";
import './ListProducts.scss'
import { CartCountContext } from "../../../../store/CartCountContext";
import { getCartLocalStorage, setCartLocalStorage } from "../../../../store/CartLocalStorage";
import Toast,{notifySuccess} from "../../../toast/Toast";

function ListProducts() {
  const cartCountContext = useContext(CartCountContext);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [pageNum, setPageNum] = useState(1);
  const [loaders, setLoaders] =useState(true);
  const [cart, setCart] = useState(() => {
    const cartData = getCartLocalStorage();
    return cartData ? cartData : [];
  });
  useEffect(()=>{
    axios.get(api+'/product')
    .then((response)=>{
        const productList = response.data.filter((product) => product.software === false & product.status === true & product.quantity>0);
        setProductList(productList);
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])
  const totalPages = Math.ceil(productList.length / itemsPerPage);
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
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

  const addToCart = (product,image) => {
    notifySuccess('Thêm thành công!');
    const productIndex = cart.findIndex((item) => item.id === product.id);
    if(productIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[productIndex].quantity += 1;
      updatedCart[productIndex].image = image;
      setCart(updatedCart);
      setCartLocalStorage(updatedCart);
      console.log(product);
    } else {
    const updatedCart = [...cart, product];
    cartCountContext.cartCountUp();
    setCart(updatedCart);
    setCartLocalStorage(updatedCart);
    console.log(product);
    }
  };
  useEffect(()=>{
    if(productList){
      setLoaders(false);
    }
  },[productList]);
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
        <div className="most-popular mode-bar">
        {/* <!-- ***** Most Popular Start ***** --> */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="heading-section">
                    <h4><em>Sản Phẩm</em> Nổi Bật</h4>
                  </div>
                  <div className="row">
                  {currentItems && currentItems.map((app) => (
                  <ProductItem
                    key={app._id}
                    id={app._id}
                    image={app.imageUrl}
                    name={app.name}
                    price={app.price}
                    saleOff={app.saleOff}
                    purchased={app.purchased}
                    onClick={addToCart}
                  ></ProductItem> 
                  ))}
                  {/* <ProductItem
                    image= {Images.appItem}
                    name='App Học Tập'
                    author='VNSIM'
                    star='4.5'
                    downLoad='1023'
                    software={true}
                  ></ProductItem> */}
                    <div className="col-lg-12">
                      <div className="main-button">
                        <a onClick={handlePrevPage} href="#product"><i className="fa fa-angle-double-left"></i></a>
                        <a href="#product">{pageNum}</a>
                        <a onClick={handleNextPage} href="#product"><i className="fa fa-angle-double-right"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/* <!-- ***** Most Popular End ***** --> */}
            <Toast/>
            </div>
      </>
     );
}

export default ListProducts;
