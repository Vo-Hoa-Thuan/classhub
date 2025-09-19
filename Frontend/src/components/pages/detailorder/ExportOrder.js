import { useEffect, useState } from 'react';
import Images from '../../../assets/img/Image';
import './ExportOrder.scss'
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Barcode from 'react-barcode';
import { useNavigate } from 'react-router-dom';

function ExportOrder() {
    const [loaders, setLoaders] =useState(false);
    const navigate = useNavigate();
    const [order,setOrder] = useState(() => {
        const data = JSON.parse(localStorage.getItem('export_order'));
        return data ? data : [];
      });
      useEffect(()=>{
        if(!order){
            navigate('/404-page');
        }},[]);
    const [dateCreate, setDateCreate] = useState(new Date());
      const handleExportPDF = () => {
        const capture = document.querySelector('.bill-container');
        setLoaders(true);
        html2canvas(capture).then((canvas)=>{
            const imgData = canvas.toDataURL('img/png');
            const doc = new jsPDF('p','mm','a4');
            const componetWidth = doc.internal.pageSize.getWidth();
            const componetHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData,'PNG',0,0,componetWidth,componetHeight);
            setLoaders(false);
            doc.save(`receipt_${order._id}.pdf`);
        })
      };
    return ( 
        <body className='container_order_bill'>
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
        <div className='action-receipt'>
            <button className='btn btn-success' onClick={handleExportPDF}>
            <i class="fas fa-file-download"></i> Tải xuống</button>
        </div>
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
            <div className="col-md-8 bill-container">
                <div className="card">
                <div className="invoice p-5">
                <div className="text-left mb-4">
                    <img src={Images.logo} style={{width:"80px"}}/>
                </div>
                    <h5 className="text-dark">Đơn đặt hàng của bạn đã được xác nhận!</h5>
                    <span className="font-weight-bold d-block mt-4">Xin chào, {order && order.userName}</span>
                    <span>Đơn hàng của bạn đã được xác nhận và sẽ được giao trong 3-4 ngày tới!</span>
                    <div className="payment border-top mt-3 mb-3 border-bottom table-responsive">
                    <table className="table table-borderless">
                        <tbody>
                        <tr>
                            <td>
                            <div className="py-2">
                                <span className="text-title-order">Ngày Tạo</span>
                                <span className="d-block text-muted">{order && moment(order.createdAt).format('DD/MM/YYYY')}</span>
                            </div>
                            </td>
                            <td>
                            <div className="py-2">
                                <span className="text-title-order">Order ID</span>
                                <span className="d-block text-muted">{order && order._id}</span>
                            </div>
                            </td>
                            <td>
                            <div className="py-2">
                                <span className="text-title-order">Thanh Toán</span>
                                <span className="d-block text-muted">
                                    {order.paymentId===null ? 
                                    "Thanh toán khi nhận hàng"
                                    :
                                    <>
                                    <img src={order.paymentId && order.paymentId.imageUrl} style={{width:"30px"}} />
                                    <span className="d-block text-muted">{order.paymentId && order.paymentId.name}</span>
                                    </>
                                    }
                                </span>
                            </div>
                            </td>
                            <td>
                            <div className="py-2">
                                <span className="text-title-order">Địa Chỉ</span>
                                <span className="d-block text-muted order-address">{order && order.address}</span>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="product border-bottom table-responsive">
                    <table className="table table-borderless">
                        <tbody>
                        {order.products && order.products.map((item)=>(
                        <tr>
                            <td style={{width:"20%"}}>
                            <img src={item.product.imageUrl} style={{width:"90px"}}/>
                            </td>
                            <td width="60%">
                            <span className="font-weight-bold">{item.product.name}</span>
                            <div className="product-qty">
                                <span>Số lượng: {item.quantity}</span>
                            </div>
                            </td>
                            <td width="20%">
                            <div className="text-right">
                                <span className="text-muted original-price">{item.priceSale.toLocaleString('vi-VN')}đ</span>
                                <span className="font-weight-bold">{item.price.toLocaleString('vi-VN')}đ</span>
                            </div>
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    <div className="row justify-content-end">
                    <div className="col-md-7">
                    <div className='order-barcode'>
                    <Barcode value={order && order._id} />
                    </div>
                    </div>
                    <div className="col-md-5">
                        <table className="table table-borderless">
                        <tbody className="totals">
                            <tr>
                            <td>
                                <div className="text-left">
                                <span className="text-muted">Subtotal</span>
                                </div>
                            </td>
                            <td>
                                <div className="text-right">
                                <span>{(parseInt(order.total)-parseInt(order.shipPrice)).toLocaleString('vi-VN')}đ</span>
                                </div>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <div className="text-left">
                                <span className="text-muted">Shipping Fee</span>
                                </div>
                            </td>
                            <td>
                                <div className="text-right">
                                <span>{parseInt(order.shipPrice).toLocaleString('vi-VN')}đ</span>
                                </div>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <div className="text-left">
                                <span className="text-muted">Discount</span>
                                </div>
                            </td>
                            <td>
                                <div className="text-right">
                                <span className="text-success">0.00</span>
                                </div>
                            </td>
                            </tr>
                            <tr className="border-top border-bottom">
                            <td>
                                <div className="text-left">
                                <span className="font-weight-bold"><b>Total</b></span>
                                </div>
                            </td>
                            <td>
                                <div className="text-right">
                                <span className="font-weight-bold"><b>{parseInt(order.total).toLocaleString('vi-VN')}đ</b></span>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                    <p>Chúng tôi sẽ gửi email xác nhận khi đơn hàng được vận chuyển thành công!</p>
                    <p className="font-weight-bold mb-0">Cảm ơn đã mua sắm với chúng tôi!</p>
                    <span>VNSIM Team</span>
                </div>
                <div className="justify-content-between footer p-3 rounded-4">
                    <span>Need Help? Visit our <a href="#">help center</a></span>
                    <span> - {moment(dateCreate).format('HH:mm, DD/MM/YYYY')}</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </body>
     );
}

export default ExportOrder;