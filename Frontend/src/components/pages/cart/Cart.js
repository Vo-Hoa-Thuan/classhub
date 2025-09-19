import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Default from '../../layout/default/Default';
import { CartCountContext } from '../../../store/CartCountContext';
import './Cart.scss'
import Toast,{notifyError} from '../../toast/Toast';
import { getCartLocalStorage, setCartLocalStorage } from '../../../store/CartLocalStorage';
import axios from 'axios';
import { api } from '../../../api';

function Cart() {
  const cartCountContext = useContext(CartCountContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const cartData = getCartLocalStorage();
    return cartData ? cartData : [];
  });
  const [total, setTotal] = useState('');
  const idUser = JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user'))._id;
  useEffect(()=>{
    const user = localStorage.getItem('user');
    if(!user){
      navigate('/404-page');
    }
  },[]);
  
  useEffect(() => {
    const newTotal = cart.reduce(
      (accumulator, product) => accumulator + product.priceSale * product.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const handleQuantityChangeUp = async(id) => {
    const productIndex = cart.findIndex((item) => item.id === id);
    let maxCountProduct = 0;
    await axios.get(api+`/product/${id}`)
    .then((res)=>{
      maxCountProduct = res.data.quantity;
    })
    .catch((err)=>{
      notifyError('Đã có lỗi xảy ra',err);
    });
    console.log(productIndex);
    const updatedCart = [...cart];
    if(updatedCart[productIndex].quantity < maxCountProduct){
      updatedCart[productIndex].quantity += 1;
    } else if(updatedCart[productIndex].quantity >= maxCountProduct){
      updatedCart[productIndex].quantity = maxCountProduct;
    }
    setCart(updatedCart);
    setCartLocalStorage(updatedCart);
  }

  const handleQuantityChangeDown = (id) => {
    const productIndex = cart.findIndex((item) => item.id === id);
    console.log(productIndex);
    const updatedCart = [...cart];
    if(updatedCart[productIndex].quantity <= 1){
      updatedCart[productIndex].quantity = 1;
    } else updatedCart[productIndex].quantity -= 1;
    setCart(updatedCart);
    setCartLocalStorage(updatedCart);
  }

  const handleRemoveProduct = (e,id) => {
    e.preventDefault();
    notifyError('Đã xóa khỏi giỏ hàng!');
    const updatedCart = cart.filter(product => product.id !== id);
    setCart(updatedCart);
    cartCountContext.setCartCount(updatedCart.length);
    setCartLocalStorage(updatedCart);
  }

  const handleClearCart = (e) => {
    e.preventDefault();
    notifyError('Xóa giỏ hàng thành công!');
    const updatedCart = [];
    setCart(updatedCart);
    cartCountContext.setCartCount(0);
    setCartLocalStorage(updatedCart);
  }

    return ( 
       <Default>
        <div className="container-fluid px-4">
          <div className="row d-flex justify-content-center my-4 swiper_apps mode-bar">
            <div className="col-md-12">
              <div className="heading-section">
                  <h4><em>VNSIM</em> / Giỏ Hàng</h4>
                  </div>
                  {cart && cart.map((product)=>(
                  <div key={product.id}>
                  <div className="row">
                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                      <div className="bg-image hover-overlay hover-zoom ripple" data-mdb-ripple-color="light">
                        <img src={product.image}
                          className="w-100 rounded" alt={product.name} />
                      </div>
                    </div>
      
                    <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                      <Link to={`/product-detail/${product.id}`}><p><strong>{product.name}</strong></p></Link>
                      <p className="original-price">{product.price.toLocaleString('vi-VN')}₫</p>
                      <p>
                        <strong>{product.priceSale.toLocaleString('vi-VN')}₫</strong>
                      </p>
                      <button type="button" className="btn btn-primary btn-sm me-1 mb-2" data-mdb-toggle="tooltip"
                        title="Remove item">
                        <i className="fas fa-sync-alt"></i>
                      </button>
                      <button onClick={(e)=>handleRemoveProduct(e,product.id)} type="button" className="btn btn-danger btn-sm mb-2" data-mdb-toggle="tooltip"
                        title="Move to the wish list">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                      <div className="d-flex mb-4" style={{maxWidth: "300px"}}>
                        {/* <div className="form-outline">
                            <p><strong>Số lượng</strong></p>
                            <input value={product.quantity} type="number" className="form-control" />
                        </div> */}
                        <div className="quantity-input-cart">
                          <a href='#down' onClick={()=>handleQuantityChangeDown(product.id)} className='down-btn-input'>-</a>
                          <input className="form-control quantity-input" min="0" name="quantity" value={product.quantity} type="number" readOnly/>
                          <a href='#up' onClick={()=>handleQuantityChangeUp(product.id)} className='up-btn-input'>+</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  </div>
                  ))}

            </div>
          </div>
          {cart.length>0 &&
          <div className='row swiper_apps mode-bar'>
            <div className="shopping-cart-footer">
                <div className="column">
                    <form className="coupon-form" method="post">
                        <input className="form-control form-control-sm" type="text" placeholder="Mã giảm giá" required=""/>
                        <button className="btn btn-outline-primary btn-sm" type="submit">Áp dụng</button>
                    </form>
                </div>
                <div className="column text-lg">
                <p><strong>Tổng Tiền: </strong></p> 
                <h4 className="title">{total.toLocaleString('vi-VN')}₫</h4></div>
            </div>
            <div className="shopping-cart-footer">
                <div className="column">
                <Link to='/products' className="btn btn-outline-secondary">
                Mua Thêm Sản Phẩm</Link>
                <a href='#clearall' onClick={handleClearCart} className='btn btn-outline-danger'>
                  Xóa Giỏ Hàng
                </a>
                </div>
                <div className="column">
                <Link to='/check-out' className="btn-checkout" href="#checkout">Thanh Toán</Link></div>
            </div>
          </div>
          }
            </div>
            <Toast/>
       </Default>
     );
}

export default Cart;