import { useParams,Link, useNavigate} from 'react-router-dom';
import './CheckOut.scss'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { api} from '../../../api';
import Default from '../../layout/default/Default';
import { getCartLocalStorage, setCartLocalStorage } from '../../../store/CartLocalStorage';
import Toast, { notifyError, notifySuccess } from '../../toast/Toast';
import { CartCountContext } from '../../../store/CartCountContext';

function CheckOut() {
    const cartCountContext = useContext(CartCountContext);
    const [dataUser, setDataUser] = useState(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        return data ? data : [];
      });
    const navigate = useNavigate();
    const [payments, setPayments] = useState();
    const [paymentId, setPaymentId] = useState(null);
    const [shippCompanys, setShippCompanys] = useState();
    const [shippCompanyId, setShippCompanyId] = useState();
    const [shippCompanyPrice, setShippCompanyPrice] = useState();
    const [totalCart, setTotalCart] = useState();
    const [products, setProducts] = useState();
    const [note, setNote] = useState('');
    const [vnpayUrl, setVNPay] = useState('');
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
      });
    const headers = {
        Authorization: `Bearer ${token}`,
        };
    useEffect(()=>{
        const user = localStorage.getItem('user');
        if(!user){
            navigate('/404-page');
        }},[]);
    const [cart, setCart] = useState(() => {
        const cartData = getCartLocalStorage();
        return cartData ? cartData : [];
      });
    const order ={
            userId: dataUser._id,
            userName: dataUser.fullname,
            phone: dataUser.phone,
            address: dataUser.address,
            products: products,
            paymentId: paymentId,
            shippingCompany: shippCompanyId,
            orderTracking: 1,
            shipPrice: shippCompanyPrice,
            total: shippCompanyPrice + totalCart,
            note: note,
            paymentStatus: false,
            shippingStatus: false,
            status: false
          }
    //Tính tổng tiền giỏ hàng
    useEffect(() => {
    const newTotal = cart.reduce(
        (accumulator, product) => accumulator + product.priceSale * product.quantity,
        0
    );
    setTotalCart(newTotal);
    let products = [];
    cart.map((item) => {
    products.push({
        product: item.id,
        price: item.price,
        priceSale: item.priceSale,
        quantity: item.quantity
    });
    });
    setProducts(products);
    }, [cart]);
    //Get hình thức thanh toán
      useEffect(() => {
        axios.get(api+'/payment/client')
          .then(response => {
            const payments = response.data.filter((item) => item.status===true);
            setPayments(payments);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
    //Get đơn vị vận chuyển
      useEffect(() => {
        axios.get(api+'/shipping-company')
          .then(response => {
            setShippCompanys(response.data);
            setShippCompanyId(response.data[0]._id);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
    //Get giá vận chuyển
    useEffect(() => {
    if(shippCompanys) {
        const item = shippCompanys.find((item) => item._id === shippCompanyId);
        setShippCompanyPrice(item.price);
        }
    }, [shippCompanyId]);

    const clearCart = ()=>{
        const updatedCart = [];
        setCart(updatedCart);
        cartCountContext.setCartCount(0);
        setCartLocalStorage(updatedCart);
    }
    const handleCheckOut = async(e) =>{
        e.preventDefault();
        console.log(order); 
        if(!dataUser || !products || !shippCompanyId || !totalCart ||!shippCompanyPrice){
            notifyError("Thông tin không được để trống. Xem lại ngay!");
        } else{
            if(paymentId!== '' & paymentId!== null){
            await axios.post(api +'/order', order, { headers })
            .then(response => {
                console.log(response.data);
                localStorage.setItem("order",JSON.stringify(response.data));
                notifySuccess("Đang chuyển hướng tới trang thanh toán!");
                //Tạo url thanh toán
                    axios.post(api +'/order/create_payment_url', 
                    {userId: order.userId, total: parseInt(order.total)}, 
                    { headers })
                    .then(response => {
                        console.log(response.data);
                        clearCart();
                        window.location.href = response.data;
                    })
                    .catch(error => {
                    console.log(error);
                    notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
                    });
            })
            .catch(error => {
            console.log(error);
            // Xử lý lỗi chi tiết từ Backend
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.error === "Không thể mua số lượng vượt quá kho") {
                    notifyError(errorData.message || "Không đủ hàng trong kho!");
                } else if (errorData.error === "Sản phẩm không tồn tại") {
                    notifyError("Một số sản phẩm không còn tồn tại. Vui lòng làm mới trang!");
                } else {
                    notifyError(errorData.message || "Đã có lỗi xảy ra. Hãy thử lại!");
                }
            } else {
                notifyError("Đã có lỗi xảy ra. Hãy thử lại!");
            }
            });
            }
        }
    }
    const handleOrderAdd = async(e)=>{
        e.preventDefault();
        console.log(order);
        if(!dataUser || !products || !shippCompanyId || !totalCart ||!shippCompanyPrice){
            notifyError("Thông tin không được để trống. Xem lại ngay!");
        } else {
            order.orderTracking=1;
            order.paymentId=null;
            await axios.post(api +'/order', order, { headers })
            .then(response => {
                console.log(response.data);
                notifySuccess("Đặt hàng thành công!");
                setTimeout(function() {
                    clearCart();
                    navigate(`/order/${dataUser._id}`)
                }, 3000);
                
            })
            .catch(error => {
            console.log(error);
            // Xử lý lỗi chi tiết từ Backend
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.error === "Không thể mua số lượng vượt quá kho") {
                    notifyError(errorData.message || "Không đủ hàng trong kho!");
                } else if (errorData.error === "Sản phẩm không tồn tại") {
                    notifyError("Một số sản phẩm không còn tồn tại. Vui lòng làm mới trang!");
                } else {
                    notifyError(errorData.message || "Đã có lỗi xảy ra. Hãy thử lại!");
                }
            } else {
                notifyError("Đã có lỗi xảy ra. Hãy thử lại!");
            }
            });
        }
    }
    return ( 
    <Default>
    <div className="row px-md-4 px-2 pt-4">
        <div className="col-lg-12">
            <p className="pb-2 fw-bold ">Chi tiết đơn hàng</p>
            <div className="card">
                <div>
                    <div className="table-responsive px-md-4 px-2 pt-3">
                        <table className="table table-borderless">
                            <tbody>
                            {cart && cart.map((product)=>(
                                <tr className="border-bottom">
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div>
                                            <img className="pic" src={product.image} alt={product.name}/>
                                            </div>
                                            <div className="ps-3 d-flex flex-column justify-content">
                                                <small className=" d-flex">
                                                <span className=" fw-bold">{product.name}</span>
                                                </small>
                                                <small className="">
                                                <div className="d-flex">
                                                    <p className="text-muted text-decoration-line-through">{product.price.toLocaleString('vi-VN')}₫</p>
                                                    <p className="pe-3 ml-2"><span className="red">{product.priceSale.toLocaleString('vi-VN')}₫</span></p>
                                                </div>
                                                </small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                        <span className="pe-3 text-muted">Số lượng</span> <span className="pe-3">
                                        <input className="ps-2" type="number" value={product.quantity} readOnly/></span>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-lg-12 row delivery px-md-4 px-2 pt-3 mt-4">
            <div className="col-md-6">
                <div className="card">
                    <small className="pt-4 fw-bold pb-2 ps-2">Hình thức vận  chuyển</small>
                    <div className="align-items-center">
                            <div className="flex-column">
                                <select className="form-control" 
                                onChange={(e)=> setShippCompanyId(e.target.value)}
                                >
                                {shippCompanys && shippCompanys.map((item)=>(
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                            <div>
                                <small className="text-muted">Thời gian vận chuyển từ 4-7 ngày</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <small className="pe-3 mr-2">{shippCompanyPrice ? shippCompanyPrice.toLocaleString('vi-VN') : '15.000'}₫</small>
                                <div className="form-check form-switch">
                                <input className="form-check-input" checked type="checkbox" id="SwitchCheck"/>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <small className="pt-4 fw-bold pb-2 ps-2">Dịch vụ bảo hành</small>
                    <div className="align-items-center">
                            <div className="flex-column">
                                <select className="form-control">
                                    <option>Bảo hành 1 năm</option>
                                    <option>Bảo hành 3 năm</option>
                                    <option>Bảo hành 5 năm</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-2">
                            <div>
                                <small className="text-muted">Luôn hỗ trợ 24/24</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <small className="pe-3 mr-2">0đ</small>
                                <div className="form-check form-switch">
                                <input className="form-check-input" checked type="checkbox" id="SwitchCheck"/>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        <div className="col-lg-12 payment-summary mt-2 mb-4">
            <p className="fw-bold pt-lg-0 pt-4 pb-2 ">Thông tin thanh toán</p>
            <div className="card px-md-3 px-2 pt-4">
                <div className="d-flex justify-content-between pb-3"> <small className="text-muted">Mã giảm giá (Nếu có)</small>
                </div>
                <div className="d-flex justify-content-between b-bottom"> 
                <input type="text" className="form-control" placeholder="NHẬP MÃ"/>
                <div className="btn btn-primary">Apply</div>
                </div>
                <div className="d-flex flex-column b-bottom">
                    <div className="d-flex justify-content-between py-3"> <small className="text-muted">Tổng sản phẩm</small>
                        <small>{totalCart && totalCart.toLocaleString('vi-VN')}₫</small>
                    </div>
                    <div className="d-flex justify-content-between pb-3"> <small className="text-muted">Phí vận chuyển</small>
                        <small>{shippCompanyPrice && shippCompanyPrice.toLocaleString('vi-VN')}₫</small>
                    </div>
                    <div className="d-flex justify-content-between"> <small className="text-muted">Tổng thanh toán</small>
                        <small>{totalCart && shippCompanyPrice && (totalCart + shippCompanyPrice).toLocaleString('vi-VN')}₫</small>
                    </div>
                </div>
                <div className="d-flex flex-column b-bottom">
                    <div className="d-flex justify-content-between py-3">
                    <small className="text-muted">Hình thức thanh toán</small>
                    </div>
                    <div className="d-flex justify-content-between pb-3"> 
                        <select 
                        id="select-payment" 
                        className="form-control"
                        onChange={(e)=> setPaymentId(e.target.value)}
                        >
                         <option value=''>Thanh toán khi nhận hàng</option>
                        {payments && payments.map((item)=>(
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                        </select>
                        </div>
                </div>
                <div className="d-flex flex-column b-bottom">
                        <div className="d-flex justify-content-between py-3"> <small className="text-muted">Tên người nhận</small>
                            <small>{dataUser && dataUser.fullname}</small>
                        </div>
                        <div className="d-flex justify-content-between pb-3"> <small className="text-muted">Địa chỉ</small>
                            <small>{dataUser && dataUser.address} | <Link to={`/profile/${dataUser._id}`} className='text-danger'>Sửa</Link></small>
                        </div>
                        <div className="d-flex justify-content-between pb-3"> <small className="text-muted">Điện thoại</small>
                            <small>{dataUser && dataUser.phone}</small>
                        </div>
                        <div className="d-flex justify-content-between pb-3">
                        <small className="text-muted">Ghi chú</small>
                            <textarea 
                            className='form-control'
                            value={note}
                            onChange={(e)=> setNote(e.target.value)}
                            />
                        </div>
                </div>
                {paymentId?
                <div className="check-out-btn mt-4 mb-2"> 
                    <a onClick={handleCheckOut} className="btn btn-success">Thanh Toán Ngay</a>
                    <a href="#home" className="btn btn-outline">Quay lại</a>
                </div>
                :
                <div className="check-out-btn mt-4 mb-2"> 
                    <a onClick={handleOrderAdd} className="btn btn-success">Đặt hàng</a>
                    <a href="#home" className="btn btn-outline">Quay lại</a>
                </div>
                }
            </div>
        </div>
    </div>
    <Toast/>
    </Default>
     );
}

export default CheckOut;
