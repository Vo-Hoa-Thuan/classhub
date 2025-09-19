import { useContext, useEffect, useState } from 'react';
import './ConfirmPayment.scss'
import axios from 'axios';
import { api } from '../../../api';
import { CartCountContext } from '../../../store/CartCountContext';
import { getCartLocalStorage, setCartLocalStorage } from '../../../store/CartLocalStorage';
import { Link, useNavigate } from 'react-router-dom';

function ConfirmPayment() {
    const params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const responseCode = params.get('vnp_ResponseCode');
    const cartCountContext = useContext(CartCountContext);
    const [cart, setCart] = useState(() => {
        const cartData = getCartLocalStorage();
        return cartData ? cartData : [];
      });

    const [productsList,setProductsList] = useState([]);
    const [statusPayment,setStatusPayment] = useState(false);
    const [order,setOrder] = useState(() => {
        const data = JSON.parse(localStorage.getItem('order'));
        return data ? data : '';
      });
    const [token,setToken] = useState(() => {
    const data = localStorage.getItem('token');
    return data ? data : '';
    });
    const headers = {
    token: `Bearer ${token}`,
    };
    useEffect(()=>{
        const user = localStorage.getItem('user');
        if(!user){
            navigate('/404-page');
    }},[]); 
    useEffect(()=>{
    if (responseCode === '00') {
    setStatusPayment(true);
    console.log('Thanh toán thành công');
    } else {
        setStatusPayment(false);
    console.log('Thanh toán không thành công');
    }
    },[])

    useEffect(()=>{
        if(order){
            axios.get(api+'/product')
            .then((response)=>{
              setProductsList(()=>{
                const productList = [];
                for(var i=0; i<response.data.length; i++){
                    for(var j=0; j<order.products.length; j++){
                      if(response.data[i]._id === order.products[j].product){
                        productList.push({
                            id: response.data[i]._id,
                            name: response.data[i].name,
                            price: order.products[j].price,
                            priceSale: order.products[j].priceSale,
                            quantity: order.products[j].quantity
                        });
                      }
                    }
                  }
                  return productList ? productList : [];
              });
              
            })
            .catch((err)=>{
              console.log(err);
            });
        }
    },[order])

    useEffect(()=>{
        if(statusPayment){
            order.paymentStatus=true;
            order.orderTracking=2;
            console.log('Order:',order);
            axios.put(api +`/order/update/${order._id}`, order, { headers })
                .then(response => {
                    console.log("Sửa thành công!");
                    const updatedCart = [];
                        setCart(updatedCart);
                        cartCountContext.setCartCount(0);
                        setCartLocalStorage(updatedCart);
                })
                .catch(error => {
                console.log(error);
                console.log("Đã có lỗi xảy ra. Hãy thử lại!")
                });
        }
    },[statusPayment])

const handleBackToOrder = (e)=>{
    e.preventDefault();
    localStorage.removeItem('order');
    navigate(`/order/${order.userId}`)
}
    return ( 
        <div class="container mt-4 mb-4">
    <div class="row d-flex cart align-items-center justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="row g-0">
                {statusPayment ===true  &&
                    <div class="col-md-6 border-right p-5">
                    <div class="text-center order-details">
                    <div class="d-flex justify-content-center mb-5 flex-column align-items-center">
                        <span class="check1"><i class="fa fa-check"></i></span>
                        <b>Thành công!</b>
                        <small class="mt-2">Đã xác nhận thanh toán đơn hàng thành công.</small>
                    </div>
                    <button onClick={handleBackToOrder} class="btn btn-danger btn-block order-button">Xem đơn hàng</button>
                    </div>
                    </div>
                }{ statusPayment===false &&
                    <div class="col-md-6 border-right p-5">
                    <div class="text-center order-details">
                    <div class="d-flex justify-content-center mb-5 flex-column align-items-center">
                        <span class="error1"><i class='bx bxs-error'></i></span>
                        <b>Thất bại!</b>
                        <small class="mt-2">Đã có lỗi xảy ra trong quá trình thanh toán đơn hàng. Hãy thử lại!</small>
                    </div>
                    <Link to={`/order/${order.userId}`}><button class="btn btn-danger btn-block order-button">Quay lại thanh toán</button></Link>
                    </div>
                    </div>
                }
                    <div class="col-md-6 background-muted">
                        <div class="p-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                        <small><i class="bx bx-time-five text-muted"></i> Thời gian giao hàng từ 4 - 7 ngày.</small>
                    </div>

                        {productsList && productsList.map((item)=>(
                        <div key={item._id} class="mt-3 detail-product-order">
                        <span>{item.name}</span><br></br>
                            <em>Số lượng: {item.quantity}</em>
                            <em>- Giá: {item.price.toLocaleString('vi-VN')}đ</em>
                        </div>
                        ))}

                        </div>
                        <div class="row g-0 border-bottom">
                            <div class="col-md-6">
                            <div class="p-3 d-flex justify-content-center align-items-center">
                                <span>Tổng tiền hàng</span>
                            </div>
                            </div>
                            <div class="col-md-6">
                            <div class="p-3 d-flex justify-content-center align-items-center">
                                <span>{order && (order.total - order.shipPrice).toLocaleString('vi-VN')}đ</span>
                            </div>
                            </div>
                        </div>
                        <div class="row g-0 border-bottom">
                            <div class="col-md-6">
                            <div class="p-3 d-flex justify-content-center align-items-center">
                                <span>Phí vận chuyển</span>
                            </div>
                            </div>
                            <div class="col-md-6">
                            <div class="p-3 d-flex justify-content-center align-items-center">
                                <span>{order && parseInt(order.shipPrice).toLocaleString('vi-VN')}đ</span>
                            </div>
                            </div>
                        </div>
                        <div class="row g-0">
                            <div class="col-md-6">
                                <div class="p-3 d-flex justify-content-center align-items-center">
                                    <b class="font-weight-bold">Thành tiền</b>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 d-flex justify-content-center align-items-center">
                                    <b class="font-weight-bold">{order && parseInt(order.total).toLocaleString('vi-VN')}đ</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div> </div>
            </div>
        </div>
    </div>
</div>
     );
}

export default ConfirmPayment;