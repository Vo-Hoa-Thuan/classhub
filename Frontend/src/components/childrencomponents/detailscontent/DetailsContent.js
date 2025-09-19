import Images from "../../../assets/img/Image";
import DetailVideo from "./DetailVideo";
import { useContext, useEffect, useState } from "react";
import { getCartLocalStorage, setCartLocalStorage } from "../../../store/CartLocalStorage";
import { CartCountContext } from "../../../store/CartCountContext";
import Toast,{notifyError, notifySuccess} from "../../toast/Toast";
import { Link } from "react-router-dom";
import axios from "axios";
import { api } from "../../../api";

function DetailsContent({product}) {
  const cartCountContext = useContext(CartCountContext);
  const [checkDL, setCheckDL] = useState(0);
  const [linkDL, setLinkDL] = useState();
  const [user,setUser] = useState(() => {
    const data = JSON.parse(localStorage.getItem('user'));
    return data ? data : [];
    });
  const [token,setToken] = useState(() => {
    const data = localStorage.getItem('token');
    return data ? data : '';
    });
    const headers = {
    token: `Bearer ${token}`,
    };
  const [cart, setCart] = useState(() => {
    const cartData = getCartLocalStorage();
    return cartData ? cartData : [];
  });

  useEffect(()=>{
    axios.post(api +'/product/check_downloaded',{
      userId: user._id,
      productId: product && product._id
    },{headers})
      .then(response => {
          console.log(response.data);
          if(response.status===200){
            setCheckDL(1);
            setLinkDL(response.data.linkDownload);
            console.log(response.data.linkDownload);
          }else {
            if(response.status===201){
              setCheckDL(2);
            }
            if(response.status===202){
              setCheckDL(3);
            }
          }
      })
      .catch(error => {
      console.log(error);
      });
      
  },[product])

  const addToCart = (product,image) => {
    notifySuccess('Thêm thành công!');
    const productIndex = cart.findIndex((item) => item.id === product.id);
    if(productIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[productIndex].quantity += 1;
      updatedCart[productIndex].image = product.image;
      updatedCart[productIndex].name = product.name;
      updatedCart[productIndex].price = product.price;
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

const handleAddToCart = () =>{
  const priceSale = parseInt(product.price) - (parseInt(product.price)*((parseInt(product.saleOff)/100)));
  const productItem = {
    id:product._id ,
    image:product.imageUrl,
    name:product.name,
    price:product.price,
    priceSale:priceSale,
    purchased:product.purchased,
    quantity: 1,
}
addToCart(productItem);
}
const handleDownload = async()=>{
const orderApp = {
  user:user._id,
  product:product._id,
  price: product.price,
  payment:"6442a91541cddc1b20f6fdce",
  paymentStatus:false,
  status:false
}
console.log(orderApp);
  await axios.post(api +'/order-app', orderApp, { headers })
      .then(response => {
          console.log("Đặt hàng thành công!");
          localStorage.setItem("orderApp",JSON.stringify(response.data));
          //Thêm order vào database
           axios.post(api +'/order-app/create_app_payment_url', 
            {userId: user._id, total: parseInt(product.price)}, 
            { headers })
            .then(response => {
                console.log(response.data);
                notifySuccess("Chuyển hướng tới trang thanh toán!");
                window.location.href = response.data;
            })
            .catch(error => {
            console.log(error);
            notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
            });
      })
      .catch(error => {
      console.log(error);
      console.log("Đã có lỗi xảy ra. Hãy thử lại!")
      });
}
const handleDownloadAgain = () =>{
  window.open(linkDL, '_blank');
}
    return ( 
        <div>
            <DetailVideo
            img={product && product.imageUrl}
            video= {product && product.videoUrl}
            ></DetailVideo>

          {/* <!-- ***** Details Start ***** --> */}
          <div className="product-details">
            <div className="row">
              <div className="col-lg-12">
                <h2>Product Details</h2>
              </div>
              <div className="col-lg-12">
                <div className="content mode-bar">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="left-info mode-page">
                        <div className="left">
                          <h4 className="title">{product && product.name}</h4>
                          <span>VNSIM</span>
                        </div>
                        <ul>
                          <li><i className="fa fa-star"></i> 4.8</li>
                          <li><i className="fa fa-download"></i> {product && product.purchased}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="right-info mode-page">
                        <ul>
                          <li className="price-product-detail">
                          <i><span className="original-price">{product && product.price.toLocaleString('vi-VN')}₫</span></i>
                          <b>{product && (parseInt(product.price) - (parseInt(product.price)*((parseInt(product.saleOff)/100)))).toLocaleString('vi-VN')}₫</b>
                        </li>
                        {product && 
                          product.software ?
                          <>
                            <li><i className="fa fa-download"></i> {product && product.purchased}</li>
                            <li><i className="fa fa-server"></i> 36GB</li>
                          </>
                          :
                          <>
                            <li><i className="bx bxs-cart"></i> {product && product.purchased}</li>
                          </>
                          }
                        </ul>
                      </div>
                    </div>
                    {product && product.imagesSub.map((item)=>(
                      <div key={item} className="col-lg-4">
                      <img className="img-sub-product" src={item} alt={product.name} style={{borderRadius: '23px', marginBottom: '30px'}}/>
                    </div>
                    ))}
                    <div className="col-lg-12">
                      <div dangerouslySetInnerHTML={{__html: product && product.desc}}></div>
                    </div>
                    <div className="col-lg-12">
                      {product && 
                      product.software && token &&
                      <>
                        { checkDL === 1 &&
                          <div className="main-border-button">
                          <a href="#download" onClick={handleDownloadAgain}>Tải lại!</a>
                        </div>
                        }
                        { checkDL === 2 &&
                          <div className="main-border-button">
                          <Link to={`/profile/${user._id}`}>Tới trang thanh toán!</Link>
                        </div>
                        }
                        { checkDL === 3 &&
                          <div className="main-border-button">
                          <a href="#download" onClick={handleDownload}>Download Now!</a>
                        </div>
                        }
                      </>
                      }
                      {product && 
                      product.software && !token &&
                      <div className="main-border-button">
                        <Link to='/login'>Download Now!</Link>
                      </div>
                      }
                      {product && !product.software && token &&
                        <div className="main-border-button">
                        <a onClick={()=>handleAddToCart()} href="#detail">Thêm vào giỏ</a>
                        </div>
                      }
                      {product && !product.software && !token &&                   
                      <div className="main-border-button">
                        <Link to='/login'>Thêm vào giỏ</Link>
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- ***** Details End ***** --> */}
          <Toast/>
        </div>
     );
}

export default DetailsContent;