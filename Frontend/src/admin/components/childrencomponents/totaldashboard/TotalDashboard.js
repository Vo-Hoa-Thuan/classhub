import { useEffect, useState } from 'react';
import './TotalDashboard.scss'
import axios from 'axios';
import { api } from '../../../../api';

function TotalDashboard() {
    const [orders, setOrders] = useState([]);
    const [ordersApp, setOrdersApp] = useState([]);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState([]);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : [];
      });
    const headers = {
    token: `Bearer ${token}`,
    };

    useEffect(()=>{
        axios.get(api+'/order',{headers})
            .then((response)=>{
            setOrders(response.data);
            const total = response.data.reduce((sum, order) => sum + parseInt(order.total), 0);
            setTotal(prev => prev + total);
            })
            .catch((err)=>{
            console.log(err);
        });
    },[]);

    useEffect(()=>{
        axios.get(api+'/order-app',{headers})
            .then((response)=>{
            setOrdersApp(response.data);
            const total = response.data.reduce((sum, order) => sum + parseInt(order.price), 0);
            setTotal(prev => prev + total);
            })
            .catch((err)=>{
            console.log(err);
        });
    },[]);

    useEffect(()=>{
        axios.get(api+'/user',{headers})
            .then((response)=>{
            setUsers(response.data);
            })
            .catch((err)=>{
            console.log(err);
        });
    },[]);

    return ( 
<div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
<div class="col">
<div class="card radius-10 border-start border-0 border-3 border-info">
<div class="card-body bg-card-bd">
<div class="d-flex align-items-center">
<div>
<p class="mb-0 text-secondary">Tổng Đơn Hàng</p>
<h4 class="my-1 text-info">{orders && orders.length}</h4>
<p class="mb-0 font-13">+2.5% so với tuần trước</p>
</div>
<div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-shopping-cart"></i>
</div>
</div>
</div>
</div>
</div>
<div class="col">
<div class="card radius-10 border-start border-0 border-3 border-danger">
<div class="card-body bg-card-bd">
<div class="d-flex align-items-center">
<div>
<p class="mb-0 text-secondary">Tổng Lượt Tải App</p>
<h4 class="my-1 text-danger">{ordersApp && ordersApp.length}</h4>
<p class="mb-0 font-13">+5.4% so với tuần trước</p>
</div>
<div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa-solid fa-download"></i>
</div>
</div>
</div>
</div>
</div>
<div class="col">
<div class="card radius-10 border-start border-0 border-3 border-success">
<div class="card-body bg-card-bd">
<div class="d-flex align-items-center">
<div>
<p class="mb-0 text-secondary">Tổng Thu Nhập</p>
<h4 class="my-1 text-success">{total&& parseInt(total).toLocaleString('vi-VN')}đ</h4> 
<p class="mb-0 font-13">-4.5% so với tuần trước</p>
</div>
<div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><i class="fa fa-dollar"></i>
</div>
</div>
</div>
</div>
</div>
<div class="col">
<div class="card radius-10 border-start border-0 border-3 border-warning">
<div class="card-body bg-card-bd">
<div class="d-flex align-items-center">
<div>
<p class="mb-0 text-secondary">Khách Hàng Mới</p>
<h4 class="my-1 text-warning">{users && users.length}</h4>
<p class="mb-0 font-13">+8.4% so với tuần trước</p>
</div>
<div class="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto"><i class="fa fa-users"></i>
</div>
</div>
</div>
</div>
</div>
</div>
     );
}

export default TotalDashboard;