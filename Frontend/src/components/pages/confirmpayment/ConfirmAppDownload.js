import { useContext, useEffect, useState } from 'react';
import './ConfirmPayment.scss'
import axios from 'axios';
import { api } from '../../../api';
import { Link, useNavigate } from 'react-router-dom';
import Toast, { notifyError, notifySuccess } from '../../toast/Toast';

function ConfirmAppDownload() {
    const params = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    const responseCode = params.get('vnp_ResponseCode');

    const [product,setProduct] = useState([]);
    const [statusPayment,setStatusPayment] = useState(false);
    const [order,setOrder] = useState(() => {
        const data = JSON.parse(localStorage.getItem('orderApp'));
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
    order.paymentStatus=true;
    setStatusPayment(true);
    axios.put(api +`/order-app/update/${order._id}`,order, { headers })
      .then(response => {
        console.log('Thanh toán thành công');
        axios.put(api+`/product/update-count-purchased/${order.product}`,order,{headers})
        .then((response)=>{
            console.log('Tăng lượt tải xuống thành công');
        })
        .catch((err)=>{
            console.log(err);
            notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
        })
      })
      .catch(error => {
      console.log(error);
      notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
      });
    } else {
        setStatusPayment(false);
    console.log('Thanh toán không thành công');
    }
    },[])

    //GET PRODUCT BY ID
    useEffect(()=>{
        axios.get(api +`/product/${order.product}`)
                .then(response => {
                    setProduct(response.data)
                })
                .catch(error => {
                console.log(error);
                });
      },[])

const handleGetDownload = async(e)=>{
    e.preventDefault();
    if(order){
        order.paymentStatus=true;
        order.status=true;
    await axios.put(api +`/order-app/update/${order._id}`,order, { headers })
      .then(response => {
        const getLinkBody={
            orderAppId: order._id,
            productId:order.product
        }
            axios.post(api +'/product/getlink_download', getLinkBody, { headers })
                .then(response => {
                    notifySuccess("Đang chuyển hướng đến trang tải xuống!");
                    localStorage.removeItem('orderApp');
                    window.open(response.data, '_blank');
                })
                .catch(error => {
                console.log(error);
                notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
                });
      })
      .catch(error => {
      console.log(error);
      notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
      });
    }   
}

const handleRePay = async(e)=>{
    e.preventDefault();
    localStorage.setItem("orderApp",JSON.stringify(order));
    axios.post(api +'/order-app/create_app_payment_url', 
    {userId: order.user, total: parseInt(order.price)}, 
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
                        <small class="mt-2">Đã xác nhận thanh toán thành công.</small>
                        <small class="mt-2">Hãy click Download để tải xuống ứng dụng của bạn.</small>
                    </div>
                    <button onClick={handleGetDownload} class="btn btn-success btn-block order-button">Download App</button>
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
                    <button onClick={handleRePay} class="btn btn-danger btn-block order-button">Quay lại thanh toán</button>
                    </div>
                    </div>
                }
                    <div class="col-md-6 background-muted">
                    <div class="p-3 border-bottom">
                        <div class="d-flex justify-content-between align-items-center">
                        <small className='text-danger'>
                        <i class="bx bx-alarm-exclamation text-danger"></i> 
                        Lưu ý: Không thoát trang khi chưa hoàn tất tải xuống.
                        </small>
                        </div>
                        <div class="mt-3 detail-product-order d-flex">
                        <img src={product && product.imageUrl} style={{width: '60px', marginRight:'10px', borderRadius: '5px'}}/>
                        <div>
                            <span>{product && product.name}</span><br></br>
                            <small className='text-detail-app'>Video HDSD: <a href={product.videoUrl}>Xem ngay</a></small>
                        </div>
                        </div>

                        </div>
                        <div class="row g-0">
                            <div class="col-md-6">
                                <div class="p-3 d-flex justify-content-center align-items-center">
                                    <b class="font-weight-bold">Đã thanh toán</b>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 d-flex justify-content-center align-items-center">
                                    <b class="font-weight-bold">{order && order.price.toLocaleString('vi-VN')}đ</b>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="p-3 d-flex justify-content-center align-items-center">
                                <Link to='/' class="btn btn-primary">Về trang chủ</Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div> </div>
            </div>
        </div>
    </div>
    <Toast/>
</div>
     );
}

export default ConfirmAppDownload;