import { useEffect, useState } from 'react';
import './SidebarMenu.scss'
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { api } from '../../../../api';

function SideBarMenu({activeSideBar}) {
    const [activeMenu, setActiveMenu] = useState();
    const [ordersCancel, setOrdersCancel] = useState([]);
    const [ordersNew, setOrdersNew] = useState([]);
    const [ordersShipping, setOrdersShipping] = useState([]);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
   const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        setActiveMenu(parseInt(sessionStorage.getItem('code')));
        axios.get(api+'/order',{headers})
        .then((response)=>{
        const data = response.data
        setOrdersCancel(data.filter((item) => item.orderTracking === 20));
        setOrdersNew(data.filter((item) => item.orderTracking === 1 & item.paymentId===null));
        setOrdersShipping(data.filter((item) => item.orderTracking === 4 || item.orderTracking === 5));
        })
        .catch((err)=>{
        console.log(err);
    });
    },[]);

    const handleActiveItem = (code)=>{
        sessionStorage.setItem('code',code);
        setActiveMenu(code);
    }
    return ( 
        <nav className={`sidebar-admin ${activeSideBar && 'show-side-bar'}`}>
         <div className="text">
         VNSIM ADMIN
         </div>
         <ul className="main_side">
            <li onClick={()=>handleActiveItem(0)} className={activeMenu===0 && 'active'}>
            <NavLink to='/admin/dashboard'>
            <i className='bx bxs-dock-top'></i>Dashboard</NavLink></li>
            <li className={activeMenu===1 && 'active'}>
               <a onClick={()=>handleActiveItem(1)} href="#" id="1">Components
               <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===1 && 'rotate'}`}></span>
               </a>
               <ul className={activeMenu===1 && 'show'}>
               <li><NavLink to='/admin/banner'>Banners</NavLink></li>
               <li><NavLink to='/admin/ship-company'>Đơn vị vận chuyển</NavLink></li>
               <li><NavLink to='/admin/payment'>Hình thức thanh toán</NavLink></li>
               </ul>
            </li>
            <li className={activeMenu===2 && 'active'}>
               <a onClick={()=>handleActiveItem(2)} href="#" id="2">Blogs
               <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===2 && 'rotate'}`}></span>
               </a>
               <ul className={activeMenu===2 && 'show'}>
               <li><NavLink to='/admin/blog'>Bài viết</NavLink></li>
               <li><NavLink to='/admin/topic'>Topic</NavLink></li>
               <li><NavLink to='/admin/comments'>Bình luận</NavLink></li>
               </ul>
            </li>
            <li className={activeMenu===3 && 'active'}>
               <a onClick={()=>handleActiveItem(3)} href="#" id="3">Orders
               <span className={`fas fa-caret-down tab-sidebar-item ${activeMenu===3 && 'rotate'}`}></span>
               </a>
               <ul className={activeMenu===3 && 'show'}>
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
            <li className={activeMenu===4 && 'active'}>
            <Link onClick={()=>handleActiveItem(4)} to='/admin/product'>Sản Phẩm</Link></li>
            <li className={activeMenu===5 && 'active'}>
            <Link onClick={()=>handleActiveItem(5)} to='/admin/customers'>Khách Hàng</Link></li>
            <li className={activeMenu===6 && 'active'}>
            <Link onClick={()=>handleActiveItem(6)} to='/admin/role'>Phân Quyền</Link></li>
            <li className={activeMenu===7 && 'active'}>
            <Link onClick={()=>handleActiveItem(7)} to='/admin/download-app'>Downloaded App</Link></li>
         </ul>
      </nav>
     );
}

export default SideBarMenu;