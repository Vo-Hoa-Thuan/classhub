import React, { useEffect, useState, useMemo } from 'react';
import './TotalDashboard.scss'
import axios from 'axios';
import { api } from '../../../../api';
import ChartBarOrder from '../chart/ChartBarOrder';
import ChartLineDownloaded from '../chart/ChartLineDownloaded';

function TotalDashboard() {
    const [orders, setOrders] = useState([]);
    const [ordersApp, setOrdersApp] = useState([]);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState([]);
    const [token] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : [];
      });
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`,
    }), [token]);

    useEffect(()=>{
        axios.get(api+'/order',{headers})
            .then((response)=>{
            console.log('Orders API Response:', response.data);
            const orders = response.data.data || response.data;
            setOrders(orders);
            const total = orders.reduce((sum, order) => sum + parseInt(order.total || 0), 0);
            setTotal(prev => prev + total);
            })
            .catch((err)=>{
            console.log('Error fetching orders:', err);
        });
    },[headers]);

    useEffect(()=>{
        axios.get(api+'/order-app',{headers})
            .then((response)=>{
            console.log('App Orders API Response:', response.data);
            const ordersApp = response.data.data || response.data;
            setOrdersApp(ordersApp);
            const total = ordersApp.reduce((sum, order) => sum + parseInt(order.price || 0), 0);
            setTotal(prev => prev + total);
            })
            .catch((err)=>{
            console.log('Error fetching app orders:', err);
        });
    },[headers]);

    useEffect(()=>{
        axios.get(api+'/user',{headers})
            .then((response)=>{
            console.log('Users API Response:', response.data);
            const users = response.data.data || response.data;
            setUsers(users);
            })
            .catch((err)=>{
            console.log('Error fetching users:', err);
        });
    },[headers]);

    return ( 
        <React.Fragment>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4">
                <div className="col">
                    <div className="card radius-10 border-start border-0 border-3 border-info">
                        <div className="card-body bg-card-bd">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-0 text-secondary">Tổng Đơn Hàng</p>
                                    <h4 className="my-1 text-info">{orders && orders.length}</h4>
                                    <p className="mb-0 font-13">+2.5% so với tuần trước</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                                    <i className="fa fa-shopping-cart"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-start border-0 border-3 border-danger">
                        <div className="card-body bg-card-bd">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-0 text-secondary">Tổng Lượt Tải App</p>
                                    <h4 className="my-1 text-danger">{ordersApp && ordersApp.length}</h4>
                                    <p className="mb-0 font-13">+5.4% so với tuần trước</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto">
                                    <i className="fa-solid fa-download"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-start border-0 border-3 border-success">
                        <div className="card-body bg-card-bd">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-0 text-secondary">Tổng Thu Nhập</p>
                                    <h4 className="my-1 text-success">{total && parseInt(total).toLocaleString('vi-VN')}đ</h4> 
                                    <p className="mb-0 font-13">-4.5% so với tuần trước</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto">
                                    <i className="fa fa-dollar"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card radius-10 border-start border-0 border-3 border-warning">
                        <div className="card-body bg-card-bd">
                            <div className="d-flex align-items-center">
                                <div>
                                    <p className="mb-0 text-secondary">Khách Hàng Mới</p>
                                    <h4 className="my-1 text-warning">{users && users.length}</h4>
                                    <p className="mb-0 font-13">+8.4% so với tuần trước</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto">
                                    <i className="fa fa-users"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Charts Section */}
            <div className="row mt-4 g-4">
                <div className="col-12 col-lg-6">
                    <div className="bg-table-admin rounded h-100 p-4">
                        <h6 className="mb-4">Thống kê đơn hàng theo tháng</h6>
                        <ChartBarOrder/>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="bg-table-admin rounded h-100 p-4">
                        <h6 className="mb-4">Thống kê lượt tải app theo tháng</h6>
                        <ChartLineDownloaded/>
                    </div>
                </div>
            </div>
        </React.Fragment>
     );
}

export default TotalDashboard;