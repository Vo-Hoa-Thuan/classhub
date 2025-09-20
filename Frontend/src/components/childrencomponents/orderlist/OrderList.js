import { useEffect, useState } from 'react';
import './OrderList.scss'
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../api';
import Toast, { notifyError, notifyWarning } from '../../toast/Toast'

function OrderList() {
    const { id } = useParams(); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [pageNum, setPageNum] = useState(1);
    const [orderList,setOrderList] = useState([]);
    const [records,setRecords] = useState([]);
    const [activeTab,setActiveTab] = useState(1);
    const [orderTrackings,setOrderTracking] = useState();
    const [cancelOrder,setCancelOrder] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
      const headers = {
        token: `Bearer ${token}`,
        };

    useEffect(()=>{
        axios.get(api +`/order/user/${id}`,{headers})
            .then(response => {
                console.log(response.data);
                const sortedOrders = response.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  });
                setOrderList(sortedOrders)
                setRecords(sortedOrders)
            })
            .catch(error => {
            console.log(error);
            });
        axios.get(api +'/order-tracking',{headers})
            .then(response => {
                console.log(response.data);
                setOrderTracking(response.data)
            })
            .catch(error => {
            console.log(error);
        });
        localStorage.removeItem('order');
        localStorage.removeItem('orderApp');
        localStorage.removeItem('export_order');
  },[cancelOrder]);

  const totalPages = Math.ceil(records.length / itemsPerPage);
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
  const currentItems = records.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="event-schedule-area-two pad100 order-list-container">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                <div className="heading-section">
                  <h4><em>Danh Sách</em> Đơn Hàng</h4>
                </div>
                    <div className="tab-control-order">
                        <ul className="nav custom-tab">
                        <li onClick={()=>{
                            setActiveTab(1);
                            setRecords(orderList);
                        }} 
                        className="nav-item">
                        <div className={`nav-link ${activeTab===1 && 'active'}`}>Tất cả</div>
                        </li>
                        <li onClick={()=>{
                            setActiveTab(2);
                            setRecords(orderList.filter((item) => item.orderTracking === 1));
                        }} 
                        className="nav-item">
                        <div className={`nav-link ${activeTab===2 && 'active'}`}>Chờ thanh toán</div>
                        </li>
                        <li onClick={()=>{
                            setActiveTab(3);
                            setRecords(orderList.filter((item) => item.orderTracking === 3 || item.orderTracking === 4));
                        }}
                        className="nav-item">
                        <div className={`nav-link ${activeTab===3 && 'active'}`}>Đang vận chuyển</div>
                        </li>
                        <li onClick={()=>{
                            setActiveTab(4);
                            setRecords(orderList.filter((item) => item.orderTracking === 5));
                        }}
                        className="nav-item d-none d-lg-block">
                        <div className={`nav-link ${activeTab===4 && 'active'}`}>Đang giao</div>
                        </li>
                        <li onClick={()=>{
                            setActiveTab(5);
                            setRecords(orderList.filter((item) => item.orderTracking === 6));
                        }}
                        className="nav-item mr-0 d-none d-lg-block">
                        <div className={`nav-link ${activeTab===5 && 'active'}`}>Hoàn thành</div>
                        </li>
                        </ul>
                    </div>
                </div>
                {currentItems && currentItems.map((item)=>(
                <div className="col-lg-12">     
                <div className="card card-body mt-3 card-order-item">
                {item.products.map((item)=>(
                <div className="mt-2 order-product-item row align-items-lg-start text-lg-left">
                    <div className="d-flex col-md-10">
                        <div className="mr-2 mb-3 mb-lg-0">
                            <img src={item.product.imageUrl} width="100px" height="100px" alt=""/>
                        </div>
                        <div className="media-body">
                        <Link to={`/product-detail/${item.product._id}`}>
                                <h4 className="media-title font-weight-semibold">
                                    <p>{item.product.name}</p>
                                </h4>
                            </Link>
                            <ul className="list-inline list-inline-dotted mb-3 mb-lg-2">
                                <li className="list-inline-item"><a href="#" className="text-muted" data-abc="true">Nhà sản xuất:</a></li>
                                <li className="list-inline-item"><a href="#" className="text-muted" data-abc="true">Class Hub</a></li>
                            </ul>
                            <p className="mb-3">Số lượng: {item.quantity}</p>
                        </div>
                    </div>
                    <div className="price-order col-md-2">
                        <ul className="list-inline list-inline-dotted mb-3 mb-lg-2">
                            <li className="list-inline-item"><a href="#" className="text-muted">
                            <span className="text-muted original-price">{item.price.toLocaleString('vi-VN')}đ</span></a></li><br></br>
                            <li className="list-inline-item"><a href="#"><h5 className="title">{item.priceSale.toLocaleString('vi-VN')}đ</h5></a></li>
                        </ul>
                    </div>
                </div>
                ))}
                <div className="media order-action-item mt-2 row">
                    <div className="media-body col-md-10">
                        <ul className="list-inline list-inline-dotted mb-3 mb-lg-2">
                            <li className="list-inline-item"><a href="#" className="text-muted">Trạng thái:</a></li>
                            <li className="list-inline-item">
                            {item.paymentId===null && item.orderTracking===1 ?
                            <a href="#" className="text-danger">Chờ xác nhận đơn hàng</a>
                            :
                            <a href="#" className="text-danger">{orderTrackings.find((track) => track.codeStatus === item.orderTracking).name}</a>
                            }
                            </li><br></br>
                            <li className="list-inline-item"><a href="#" className="text-muted">Hình thức thanh toán:</a></li>
                            <li className="list-inline-item"><a href="#" className="text-danger">{item.paymentId ? 'Thanh toán qua VNPay':"Thanh toán khi nhận hàng"}</a></li>
                        </ul>
                        {!item.paymentStatus && item.paymentId !== null && item.orderTracking===1 &&
                                <>
                                    <button type="button" onClick={(e)=>handleCheckOut(e,item)} className="btn btn-primary mt-2 mr-2 text-white">Thanh toán</button>
                                    <button type="button" onClick={(e)=>handleCancelOrder(e,item._id)} className="btn btn-danger mt-2 text-white">Hủy đơn hàng</button>
                                </>
                        }
                        {item.orderTracking===1 && item.paymentId === null &&
                                    <button type="button" onClick={(e)=>handleCancelOrder(e,item._id)} className="btn btn-danger mt-2 text-white">Hủy đơn hàng</button>
                            }
                        {item.orderTracking===2 &&
                                    <button type="button" onClick={(e)=>handleCancelOrder(e,item._id)} className="btn btn-danger mt-2 text-white">Hủy đơn hàng</button>
                        }
                        {/* <h6 className="media-title font-weight-semibold">
                            <b className="text-dark">Thành tiền</b><h4 className="text-dark">300.000đ</h4>
                        </h6> */}
                    </div>
                    <div className="mt-lg-0 ml-lg-3 col-md-2">
                    <ul className="list-inline list-inline-dotted mb-3 mb-lg-2">
                            <li className="list-inline-item"><a href="#" className="text-muted">Tổng tiền:</a></li>
                            <li className="list-inline-item"><a href="#" className="text-danger"><b>{parseInt(item.total).toLocaleString('vi-VN')}đ</b></a></li>
                        </ul>
                            <Link to={`/user/detail-order/${item._id}`} type="button" className="btn btn-warning mt-2 text-white">Xem chi tiết</Link>
                    </div>
                </div>
            </div>              
                </div>
                ))}
        <div className="col-lg-12 mt-4">
            <div className="main-button button-page-order">
                <a onClick={handlePrevPage} href="#product"><i className="fa fa-angle-double-left"></i></a>
                <a href="#product">{pageNum}</a>
                <a onClick={handleNextPage} href="#product"><i className="fa fa-angle-double-right"></i></a>
            </div>
        </div>
    </div>
</div>
<Toast/>
</div>
     );
}

export default OrderList;