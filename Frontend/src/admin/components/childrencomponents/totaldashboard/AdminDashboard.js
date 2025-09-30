import React, { useEffect, useState, useMemo } from 'react';
import './TotalDashboard.scss'
import axios from 'axios';
import { api } from '../../../../api';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [regularUsers, setRegularUsers] = useState([]);
    const [token] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : [];
      });
    const headers = useMemo(() => ({
        Authorization: `Bearer ${token}`,
    }), [token]);

    useEffect(()=>{
        axios.get(api+'/user',{headers})
            .then((response)=>{
            console.log('API Response:', response.data);
            const users = response.data.data || response.data; // Handle both response structures
            setUsers(users);
            // Phân loại user
            const admins = users.filter(user => user.role === 'admin' || user.role === 'adminBlogger');
            const regulars = users.filter(user => user.role === 'user' || user.role === 'productManager');
            setAdminUsers(admins);
            setRegularUsers(regulars);
            console.log('Admins:', admins);
            console.log('Regulars:', regulars);
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
                                    <p className="mb-0 text-secondary">Tổng Người Dùng</p>
                                    <h4 className="my-1 text-info">{users && users.length}</h4>
                                    <p className="mb-0 font-13">Tất cả người dùng trong hệ thống</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto">
                                    <i className="fa fa-users"></i>
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
                                    <p className="mb-0 text-secondary">Quản Trị Viên</p>
                                    <h4 className="my-1 text-danger">{adminUsers && adminUsers.length}</h4>
                                    <p className="mb-0 font-13">Admin và Admin Blogger</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto">
                                    <i className="fa fa-user-shield"></i>
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
                                    <p className="mb-0 text-secondary">Người Dùng Thường</p>
                                    <h4 className="my-1 text-success">{regularUsers && regularUsers.length}</h4>
                                    <p className="mb-0 font-13">Khách hàng và blogger thường</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto">
                                    <i className="fa fa-user"></i>
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
                                    <p className="mb-0 text-secondary">Tỷ Lệ Admin</p>
                                    <h4 className="my-1 text-warning">{users && users.length > 0 ? Math.round((adminUsers.length / users.length) * 100) : 0}%</h4>
                                    <p className="mb-0 font-13">Phần trăm quản trị viên</p>
                                </div>
                                <div className="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto">
                                    <i className="fa fa-chart-pie"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
     );
}

export default AdminDashboard;