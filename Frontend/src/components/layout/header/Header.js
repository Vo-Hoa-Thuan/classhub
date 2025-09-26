import React, {useContext, useEffect, useState} from 'react'
import { Link, NavLink, useNavigate} from 'react-router-dom';
import './Header.scss'
import Images from '../../../assets/img/Image'
import DialogSearch from '../../dialogs/dialogsearch/DialogSearch'
import { CartCountContext } from '../../../store/CartCountContext';
import authService from '../../../services/AuthService';
import SessionManagement from '../../dialogs/sessionmanagement/SessionManagement';

function Header({searchOff,themeContext}) {
  themeContext.setTheme(localStorage.getItem("theme"));
  const cartCountContext = useContext(CartCountContext);
  const [isDark, setDark] = useState(localStorage.getItem("theme") === "dark")
  const [isView, setView] = useState(false)
  const [search, setSearch] = useState('')
  const [showSessionManagement, setShowSessionManagement] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  console.log('Header - Current user:', user);
  console.log('Header - User exists:', !!user);

  const hanlChangleMode = ()=>{
    setDark(!isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
  }

  useEffect(() => {
    console.log('Them là: ',themeContext.theme);
  }, [themeContext.theme]);

  const viewDialogSearch = () =>{
    if(isView){
      setView(false)
    } else {
      setView(true)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.stopTokenExpiryTimer();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      authService.clearTokens();
      authService.clearUser();
      authService.stopTokenExpiryTimer();
      navigate('/');
      window.location.reload();
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('keyword', search);
    navigate(`/search-result?${params}`);
  }
  return ( 
    <div>
<header className="header" id="header">
            <nav className="nav">
                <a href="#home" className="nav__logo"><img src={Images.logo} alt="" style={{width:"200px"}}/></a>

                <div className="nav__menu" id="nav-menu">
                    <ul className="nav__list">
                        <li className="nav__item">
                            <NavLink to='/' className='nav__link' id='homeHeader'> 
                                <i className='bx bx-home-alt nav__icon'></i>
                                <span className="nav__name">Home</span>
                            </NavLink>
                        </li>
                        
                        <li className="nav__item">
                            <NavLink to='/products' className="nav__link" id='productsHeader'>
                              <i className='bx bx-food-menu nav__icon'></i>
                              <span className="nav__name">Products</span>
                            </NavLink>
                        </li>

                        <li className="nav__item nav_search">
                            <a href="#portfolio" className="nav__link" onClick={viewDialogSearch} id='searchHeader'>
                                <i className='bx bx-search nav__icon'></i>
                                <span className="nav__name">Tìm</span>
                            </a>
                        </li>

                        <li className="nav__item">
                            <NavLink to='/blogs' className="nav__link" id='blogsHeader'>
                                <i className='bx bxs-news nav__icon'></i>
                                <span className="nav__name">Blogs</span>
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink to='/service' className="nav__link" id='serviceHeader'>
                                <i className='bx bx-briefcase-alt nav__icon'></i>
                                <span className="nav__name">Service</span>
                            </NavLink>
                        </li>

                    </ul>
                </div>
                {!searchOff ? 
                <div className="search-input">
                  <form id="search" onSubmit={handleSearch}>
                    <input className='mode-page' type="text" onChange={(e) => {setSearch(e.target.value); console.log(search)}} placeholder="Tìm..." id='searchText' name="searchKeyword"/>
                    <i onClick={handleSearch} className='bx bx-search'></i>
                  </form>
                </div>
                : null
                }
                <div className='profie__nav' id='profileHeader'>
                {user
                ? <>
                <div className='user-menu-container'>
                  <div className='profile_container' onClick={toggleUserMenu}>
                    <span className='user-name'>{user.fullname}</span>
                    <img src={user.image ? user.image : Images.avatar} alt="" className="nav__img"/>
                    <i className='bx bx-chevron-down user-menu-arrow'></i>
                  </div>
                  
                  {showUserMenu && (
                    <div className='user-dropdown-menu'>
                      <NavLink to={`/profile/${user._id}`} onClick={() => setShowUserMenu(false)}>
                        <i className='bx bx-user'></i>
                        <span>Hồ sơ của tôi</span>
                      </NavLink>
                      
                      {/* Admin Dashboard link for admin/blogger/productManager */}
                      {(user.admin === true || user.role === 'blogger' || user.role === 'productManager') && (
                        <NavLink to="/admin/dashboard" onClick={() => setShowUserMenu(false)}>
                          <i className='bx bx-cog'></i>
                          <span>Admin Dashboard</span>
                        </NavLink>
                      )}
                      
                      <button onClick={() => { setShowSessionManagement(true); setShowUserMenu(false); }}>
                        <i className='bx bx-devices'></i>
                        <span>Quản lý Sessions</span>
                      </button>
                      <button onClick={handleLogout}>
                        <i className='bx bx-log-out'></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <Link to='/cart'>
                <div className='cart-container'>
                <div className='cart-count'>{cartCountContext.cartCount}</div>
                <i className='bx bxs-cart' ></i>
                </div></Link>
                </>
                :
                <NavLink to='/login'>
                <div className='profile_container'>
                <span className='title-login'>Đăng nhập</span>
                </div>
                <div className='icon-login'>
                <i className='bx bx-log-in'></i>
                </div>
                </NavLink>
                }
                <div className='btn_mode' onClick={hanlChangleMode}>
                <i className={`bx bx-sun nav__mode__icon ${isDark ? 'active_mode' : ''}`}></i>
                <i className={`bx bxs-moon nav__mode__icon ${isDark ? '' : 'active_mode'}`}></i>
                </div>
                </div>
            </nav>
        </header>
        <DialogSearch view={isView}></DialogSearch>
        <SessionManagement 
          isOpen={showSessionManagement} 
          onClose={() => setShowSessionManagement(false)} 
        />
        </div>
   );
}

export default Header;
