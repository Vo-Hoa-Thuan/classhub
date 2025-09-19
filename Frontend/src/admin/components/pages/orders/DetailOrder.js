import { Link, useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../layout/default/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../../api";
import moment from "moment";
import './OrdersAdmin.scss'
import Toast, { notifyError, notifySuccess, notifyWarning } from "../../../../components/toast/Toast";

function DetailOrder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order,setOrder] = useState([]);
    const [cancelOrder,setCancelOrder] = useState(false);
    const [orderTrackings,setOrderTrackings] = useState([]);
    const [orderTrackingName,setOrderTrackingName] = useState();
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
  const headers = {
      token: `Bearer ${token}`,
      };
  useEffect(()=>{
      axios.get(api+`/order/${id}`,{headers})
          .then((response)=>{
          console.log(response.data);
          const data = response.data;
          setOrder(response.data);
      axios.get(api +'/order-tracking',{headers})
        .then(response => {
            console.log(response.data);
            const name = response.data.find((track) => track.codeStatus === data.orderTracking).name;
            setOrderTrackingName(name);
            console.log("Tên là",name);
            setOrderTrackings(response.data)
        })
        .catch(error => {
        console.log(error);
        });
          })
          .catch((err)=>{
          console.log(err);
      });
      },[cancelOrder]);

    const handleConfirmCancel = async(e) =>{
      e.preventDefault();
      await axios.put(api +`/order/update/${id}`, {orderTracking: 21}, { headers })
          .then(response => {
              notifyWarning("Đã xác nhận hủy đơn hàng!");
              setCancelOrder(!cancelOrder);
          })
          .catch(error => {
          console.log(error);
          notifyError("Đã có lỗi xảy ra. Hãy thử lại!")
          });
    }

    const handleChangeOrder = async(e,codeTracking) =>{
      e.preventDefault();
      await axios.put(api +`/order/update/${id}`, {orderTracking: (parseInt(codeTracking)+1)}, { headers })
          .then(response => {
              notifySuccess("Đã chuyển trạng thái đơn hàng!");
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
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
        <div className="row">
        <div className="col-lg-8">
        <div className="card mb-4">
        <div className="card-body">
        <h4 className="mb-4">Chi Tiết Đơn Hàng</h4>
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
        <h6 className="small mb-0"><a href="#" className="text-reset">{item.product && item.product.name}</a></h6>
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

        <div className="card-body">
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
        <hr/>
        <h3 className="h6">Ghi chú</h3>
        <p>{order.note ? order.note : 'Trống'}</p>
        </div>
        </div>
        </div>

        <div className="col-lg-4">
        <div className="card mb-4">
            <div className="card-body">
                <div className="tracking">
                    <div className="title">Trạng Thái Đơn Hàng</div>
                </div>
                <div className="status-order">
                  <input type="text" value={orderTrackingName && orderTrackingName} disabled className="form-control"/>
                    {order.orderTracking===20 && <button onClick={handleConfirmCancel} className="btn btn-danger">Xác nhận hủy</button>}
                    {order.orderTracking===1 && <button onClick={(e)=>handleChangeOrder(e, order.orderTracking)} className="btn btn-danger">Xác nhận đơn hàng</button>}
                    {order.orderTracking===2 || order.orderTracking===3 || order.orderTracking===4 || order.orderTracking===5 ? <button onClick={(e)=>handleChangeOrder(e, order.orderTracking)} className="btn btn-danger">Chuyển trạng thái</button> : ''}
                    <Link to='/admin/orders' className="btn btn-secondary">Quay lại</Link>
                </div>
            </div>
            </div>
        </div>
        </div>
        </div>
        <Toast/>
        </DefaultLayout>
     );
}

export default DetailOrder;