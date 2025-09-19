import { Link, useNavigate, useParams } from 'react-router-dom';
import Default from '../../layout/default/Default'
import './DetailOrderUser.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../../api';
import moment from 'moment';
import Toast, { notifyError, notifyWarning } from '../../toast/Toast';

function DetailOrderUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order,setOrder] = useState([]);
    const [cancelOrder,setCancelOrder] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
    const headers = {
        token: `Bearer ${token}`,
        };
    useEffect(()=>{
    const user = localStorage.getItem('user');
    if(!user || !id){
        navigate('/404-page');
    }},[]);
    useEffect(()=>{
        axios.get(api+`/order/${id}`,{headers})
            .then((response)=>{
            console.log(response.data);
            setOrder(response.data);
            })
            .catch((err)=>{
            console.log(err);
        });
        },[cancelOrder]);

    const handleCancelOrder = async(e,id)=>{
        e.preventDefault();
        console.log(id);
        await axios.put(api +`/order/update/${id}`, {orderTracking: 20}, { headers })
            .then(response => {
                notifyWarning("Đã gửi yêu cầu hủy đơn hàng!");
                setCancelOrder(!cancelOrder);
            })
            .catch(error => {
            console.log(error);
            notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
            });
        }
    
        const handleExportOrder = () => {
           localStorage.setItem("export_order",JSON.stringify(order));
           navigate('/export-order');
          };

          const handleCheckOut = async(e,item) =>{
            e.preventDefault();
            console.log(item);
            //Tạo url thanh toán
            axios.post(api +'/order/create_payment_url', 
            {userId: item.userId, total: parseInt(item.total)}, 
            { headers })
            .then(response => {
                localStorage.setItem("order",JSON.stringify(item));
                console.log(response.data);
                window.location.href = response.data;
            })
            .catch(error => {
            console.log(error);
            notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
            });
        }

    return ( 
        <Default>
        <div className="row">
        <div className="col-lg-8">
        
            <div className="card mb-4">
            <div className="card-body rounded-3">
                <div className="tracking">
                    <div className="title">Trạng Thái Đơn Hàng</div>
                </div>
                {order.orderTracking ===20 || order.orderTracking ===21 ?
                <div className="track">
                    <div className={`step ${order.orderTracking===20 ||order.orderTracking===21 ? 'active':''}`}> <span className="icon"> <i class="fas fa-share-square"></i> </span> <span className="text">Gửi yêu cầu hủy đơn</span> </div>
                    <div className={`step ${order.orderTracking===21 ? 'active' : ''}`}> <span className="icon"> <i class="fas fa-check"></i> </span> <span className="text"> Đã hủy thành công</span> </div>
                </div>
                :
                <div className="track">
                    <div className={`step ${order.orderTracking===1 ||order.orderTracking===2 || order.orderTracking===3 ||order.orderTracking===4 || order.orderTracking===5|| order.orderTracking===6 ? 'active':''}`}> <span className="icon"> <i class="fas fa-wallet"></i> </span> <span className="text">Đặt hàng</span> </div>
                    <div className={`step ${order.orderTracking===2 || order.orderTracking===3 ||order.orderTracking===4 || order.orderTracking===5|| order.orderTracking===6 ? 'active' : ''}`}> <span className="icon"> <i className="fa fa-box"></i> </span> <span className="text"> Đang đóng gói</span> </div>
                    <div className={`step ${order.orderTracking===4 || order.orderTracking===5 || order.orderTracking===6 ? 'active' : ''}`}> <span className="icon"> <i className="fa fa-truck"></i> </span> <span className="text"> Đang giao hàng </span> </div>
                    <div className={`step ${order.orderTracking===6 && 'active'}`}> <span className="icon"> <i className="fa fa-check"></i> </span> <span className="text">Đã giao thành công</span> </div>
                </div>
                }
            </div>
            </div>
        
        <div className="card mb-4">
        <div className="card-body rounded-3">
        <div className="mb-3 d-flex justify-content-between">
        <div>
        <span className="me-3">ID: #{order._id}</span>
        <span className="me-3">Thời gian: {moment(order.createdAt).format('HH:mm, DD/MM/YYYY')}</span>
        <span className="me-3">
        <button onClick={handleExportOrder} className='btn btn-primary text-right'>
        <i class="fas fa-print"></i> Xuất hóa đơn</button></span>
        </div>
        </div>
        <table className="table table-borderless">
        <tbody>
        {order && order.products && order.products.map((item)=>(
        <tr>
        <td>
        <div className="d-flex mb-2">
        <div className="flex-shrink-0">
        <img src={item.product.imageUrl} alt="" style={{width:'75px'}} className="img-fluid"/>
        </div>
        <div className="flex-lg-grow-1 ms-3">
        <h6 className="small mb-0"><Link to={`/product-detail/${item.product._id}`} className="h6">{item.product.name}</Link></h6>
        <span className="small">Số lượng: {item.quantity}</span>
        </div>
        </div>
        </td>
        <td>Giá:</td>
        <td className="text-muted original-price">{item.priceSale.toLocaleString('vi-VN')}đ</td>
        <td className="text-end">{item.price.toLocaleString('vi-VN')}đ</td>
        </tr>
        ))}
        </tbody>
        <tfoot>
        <tr>
        <td colspan="2">Tổng sản phẩm</td>
        <td className="text-end">{(parseInt(order.total)-parseInt(order.shipPrice)).toLocaleString('vi-VN')}đ</td>
        </tr>
        <tr>
        <td colspan="2">Phí vận chuyển</td>
        <td className="text-end">{parseInt(order.shipPrice).toLocaleString('vi-VN')}đ</td>
        </tr>
        <tr>
        <td colspan="2">Giảm giá</td>
        <td className="text-danger text-end">-0</td>
        </tr>
        <tr className="fw-bold">
        <td colspan="2">Tổng tiền</td>
        <td className="text-end">{parseInt(order.total).toLocaleString('vi-VN')}đ</td>
        </tr>
        </tfoot>
        </table>
        </div>
        </div>
        <div className="action-detail-order">
        {order.orderTracking===1 && order.paymentId!==null &&
            <>
                <button onClick={(e)=>handleCheckOut(e,order)} className="btn btn-primary">Thanh toán</button>
                <button onClick={(e)=>handleCancelOrder(e,order._id)} className="btn btn-danger">Hủy đơn hàng</button>
            </>
        }
        {order.orderTracking===1 && order.paymentId===null &&
            <button onClick={(e)=>handleCancelOrder(e,order._id)} className="btn btn-danger">Hủy đơn hàng</button>
        }
        {order.orderTracking===2 &&
            <button onClick={(e)=>handleCancelOrder(e,order._id)} className="btn btn-danger">Hủy đơn hàng</button>
        }
            <Link to={`/order/${order.userId}`} className="btn btn-secondary">Quay lại</Link>
        </div>
        </div>

        <div className="col-lg-4">
        <div className="card mb-4">
        <div className="card-body rounded-3">
        <h3 className="h6">Ghi chú</h3>
        <p>{order.note ? order.note : 'Trống'}</p>
        </div>
        </div>
        <div className="card mb-4">
        
        <div className="card-body rounded-3">
        <h3 className="h6">Thông tin vận chuyển</h3>
        <b>{order.shippingCompany && order.shippingCompany.name}</b><br/>
        <small>Mã vận chuyển: #{order.shippingCompany && order.shippingCompany._id}<br/>
        Giá: {order.shippingCompany && order.shippingCompany.price.toLocaleString('vi-VN')}đ</small>
        <hr/>
        <h3 className="h6">Hình thức thanh toán</h3>
        {order.paymentId===null ?
        <>
            <b>Thanh toán khi nhận hàng</b><br/>
            <p>Thanh toán: {parseInt(order.total).toLocaleString('vi-VN')}đ
            </p>
        </>
        :
        <p>
        <img src={order.paymentId && order.paymentId.imageUrl} alt={order.paymentId && order.paymentId.name} style={{width: '100px'}}/><br/>
        Thanh toán: {parseInt(order.total).toLocaleString('vi-VN')}đ 
        {order.paymentStatus ?
            <span className="badge bg-success rounded-pill">Đã trả</span>
        :
            <span className="badge bg-danger rounded-pill">Chưa thanh toán</span>
        }
        </p>
        }
        <hr/>
        <h3 className="h6">Địa chỉ</h3>
        <address>
        <strong>{order.userName}</strong><br/>
        {order.address}<br/>
        <small>Điện thoại: {order.phone}</small> 
        </address>
        </div>
        </div>
        </div>
        </div>
        <Toast/>
        </Default>
     );
}

export default DetailOrderUser;