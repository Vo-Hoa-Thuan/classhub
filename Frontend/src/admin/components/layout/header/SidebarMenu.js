import { useEffect, useState } from 'react';
import './SidebarMenu.scss'
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../../api';
import { usePermissions } from '../../../../hooks/usePermissions';

function SideBarMenu({activeSideBar}) {
    const [activeMenu, setActiveMenu] = useState();
    const [ordersCancel, setOrdersCancel] = useState([]);
    const [ordersNew, setOrdersNew] = useState([]);
    const [ordersShipping, setOrdersShipping] = useState([]);
    const [token] = useState(() => {
      const data = localStorage.getItem('accessToken');
      return data ? data : '';
    });
    
    // Sử dụng usePermissions hook
    const {
        canViewAnalytics,
        canManageUsers,
        canManageBanners,
        canManagePaymentMethods,
        canManageShipping,
        canCreatePosts,
        canEditPosts,
        canDeletePosts,
        canManageTopics,
        canConfirmOrders,
        canCancelOrders,
        canManageProducts,
        isAdmin,
        isProductManager,
        isBlogger
    } = usePermissions();
    
    useEffect(()=>{
        setActiveMenu(parseInt(sessionStorage.getItem('code')));
        if(token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            axios.get(api+'/order',{headers})
            .then((response)=>{
            const data = response.data.data || response.data
            setOrdersCancel(data.filter((item) => item.orderTracking === 20));
            setOrdersNew(data.filter((item) => item.orderTracking === 1 & item.paymentId===null));
            setOrdersShipping(data.filter((item) => item.orderTracking === 4 || item.orderTracking === 5));
            })
            .catch((err)=>{
            console.log('Error fetching orders in sidebar:', err);
        });
        }
    },[token]);

    const handleActiveItem = (code)=>{
        sessionStorage.setItem('code',code);
        setActiveMenu(code);
    }
    return ( 
        <nav className={`sidebar-admin ${activeSideBar ? 'show-side-bar' : ''}`}>
         <div className="text">
         Class Hub ADMIN
         </div>
         <ul className="main_side">
            {/* Dashboard - Cần quyền quản lý người dùng hoặc quản lý sản phẩm */}
            {(canManageUsers || canManageProducts) && (
                <li onClick={()=>handleActiveItem(0)} className={activeMenu===0 ? 'active' : ''}>
                <NavLink to='/admin/dashboard'>
                <i className='bx bxs-dock-top'></i>Dashboard</NavLink></li>
            )}
            
            {/* Analytics - Cần quyền xem thống kê */}
            {canViewAnalytics && (
                <li onClick={()=>handleActiveItem(10)} className={activeMenu===10 ? 'active' : ''}>
                <NavLink to='/admin/analytics'>
                <i className='bx bxs-bar-chart-alt-2'></i>Analytics</NavLink></li>
            )}
            
            {/* Components - Cần quyền quản lý banner, thanh toán, hoặc vận chuyển */}
            {(canManageBanners || canManagePaymentMethods || canManageShipping) && (
                <li className={activeMenu===1 ? 'active' : ''}>
                   <a onClick={()=>handleActiveItem(1)} href="#components" id="1">Components
                   <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===1 ? 'rotate' : ''}`}></span>
                   </a>
                   <ul className={activeMenu===1 ? 'show' : ''}>
                   {canManageBanners && <li><NavLink to='/admin/banner'>Banners</NavLink></li>}
                   {canManageShipping && <li><NavLink to='/admin/ship-company'>Đơn vị vận chuyển</NavLink></li>}
                   {canManagePaymentMethods && <li><NavLink to='/admin/payment'>Hình thức thanh toán</NavLink></li>}
                   </ul>
                </li>
            )}
            
            {/* Blogs - Cần quyền quản lý bài viết hoặc chủ đề */}
            {(canCreatePosts || canEditPosts || canDeletePosts || canManageTopics) && (
                <li className={activeMenu===2 ? 'active' : ''}>
                   <a onClick={()=>handleActiveItem(2)} href="#blogs" id="2">Blogs
                   <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===2 ? 'rotate' : ''}`}></span>
                   </a>
                   <ul className={activeMenu===2 ? 'show' : ''}>
                   {(canCreatePosts || canEditPosts || canDeletePosts) && <li><NavLink to='/admin/blog'>Bài viết</NavLink></li>}
                   {canManageTopics && <li><NavLink to='/admin/topic'>Topic</NavLink></li>}
                   <li><NavLink to='/admin/comments'>Bình luận</NavLink></li>
                   </ul>
                </li>
            )}
            
            {/* Orders - Cần quyền xác nhận hoặc hủy đơn hàng */}
            {(canConfirmOrders || canCancelOrders) && (
                <li className={activeMenu===3 ? 'active' : ''}>
                   <a onClick={()=>handleActiveItem(3)} href="#orders" id="3">Orders
                   <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===3 ? 'rotate' : ''}`}></span>
                   </a>
                   <ul className={activeMenu===3 ? 'show' : ''}>
                      <li><NavLink to='/admin/orders'>Tất cả</NavLink></li>
                      <li>
                      <NavLink to='/admin/orders-shipping'>Đang vận chuyển</NavLink>
                      {ordersShipping&&ordersShipping.length!==0 &&
                      <div className='container-count-orders'>
                      <p className='count-orders'>{ordersShipping.length}</p>
                      </div>}
                      </li>
                      <li>
                      <NavLink to='/admin/orders-new'>Chờ xác nhận
                      {ordersNew && ordersNew.length!==0 &&
                      <div className='container-count-orders'>
                      <p className='count-orders'>{ordersNew.length}</p>
                      </div>}
                      </NavLink>
                      </li>
                      <li>
                      <NavLink to='/admin/orders-cancel'>Yêu cầu hủy đơn</NavLink>
                      {ordersCancel && ordersCancel.length!==0 &&
                      <div className='container-count-orders'>
                      <p className='count-orders'>{ ordersCancel.length }</p>
                      </div>}
                      </li>
                   </ul>
                </li>
            )}
            
            {/* Sản Phẩm - Cần quyền quản lý sản phẩm */}
            {canManageProducts && (
                <li className={activeMenu===4 ? 'active' : ''}>
                <Link onClick={()=>handleActiveItem(4)} to='/admin/product'>Sản Phẩm</Link></li>
            )}
            
            {/* Khách Hàng - Cần quyền quản lý người dùng */}
            {canManageUsers && (
                <li className={activeMenu===5 ? 'active' : ''}>
                <Link onClick={()=>handleActiveItem(5)} to='/admin/customers'>Khách Hàng</Link></li>
            )}
            
            {/* Phân Quyền - Cần quyền quản lý người dùng hoặc phân quyền */}
            {canManageUsers && (
                <li className={activeMenu===6 ? 'active' : ''}>
                <Link onClick={()=>handleActiveItem(6)} to='/admin/role'>Phân Quyền</Link></li>
            )}
            
            {/* Downloaded App - Admin only */}
            {isAdmin && (
                <li className={activeMenu===7 ? 'active' : ''}>
                <Link onClick={()=>handleActiveItem(7)} to='/admin/download-app'>Downloaded App</Link></li>
            )}
            
            {/* Permissions - All admin users */}
            {(isAdmin || isProductManager || isBlogger) && (
                <li className={activeMenu===8 ? 'active' : ''}>
                <Link onClick={()=>handleActiveItem(8)} to='/admin/permissions'>Quyền Truy Cập</Link></li>
            )}
            
         </ul>
      </nav>
     );
}

export default SideBarMenu;
