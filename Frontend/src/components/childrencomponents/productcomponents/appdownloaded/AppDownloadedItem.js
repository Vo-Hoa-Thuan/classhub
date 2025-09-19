import axios from 'axios';
import moment from 'moment'
import { api } from '../../../../api';
import { useState } from 'react';
import { notifyError, notifySuccess } from '../../../toast/Toast';

function AppDownloadedItem({order}) {
    const outputDateString = moment(order.createdAt).format('HH:mm, DD/MM/YYYY');
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
        });
        const headers = {
        token: `Bearer ${token}`,
        };

    const handlePayment = async(e)=>{
        e.preventDefault();
        const orderApp = {
            _id: order._id,
            user:order.user._id,
            product:order.product._id,
            price: order.price,
            payment:order.payment._id,
            paymentStatus:order.paymentStatus,
            status:order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            __v: 0
          }
        localStorage.setItem("orderApp",JSON.stringify(orderApp));
        axios.post(api +'/order-app/create_app_payment_url', 
        {userId: orderApp.user, total: parseInt(orderApp.price)}, 
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

    const GetLinkDownLoad = ()=>{
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
    }
    return ( 
        <div className="item">
            <ul>
            <li><img src={order.product.imageUrl} alt="" className="templatemo-item"/></li>
            <li><h4 className="title">{order.product.name}</h4><span>VNSIM</span></li>
            <li><h4 className="title">Ngày Tải</h4><span>{outputDateString}</span></li>
            <li><h4 className="title">Trạng Thái</h4>
            <span>{order.status && order.paymentStatus && 'Downloaded'}
            {!order.status && !order.paymentStatus && 'Chưa thanh toán'}
            {!order.status && order.paymentStatus && 'Đã thanh toán'}
            </span></li>
            {order.paymentStatus ?
            <li><div onClick={GetLinkDownLoad} className="main-border-button border-no-active"><a href="#">Tải Lại</a></div></li>
            :
            <li><div onClick={handlePayment} className="main-border-button border-active"><a href="">Thanh toán</a></div></li>
            }
            </ul>
        </div>
     );
}

export default AppDownloadedItem;