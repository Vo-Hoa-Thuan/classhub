import React, {useContext, useEffect, useState} from 'react'
import { Link, NavLink, useNavigate} from 'react-router-dom';
import './Header.scss'
import Images from '../../../assets/img/Image'
import DialogSearch from '../../dialogs/dialogsearch/DialogSearch'
import { CartCountContext } from '../../../store/CartCountContext';

function Header({searchOff,themeContext}) {
  themeContext.setTheme(localStorage.getItem("theme"));
  const cartCountContext = useContext(CartCountContext);
  const [isDark, setDark] = useState(localStorage.getItem("theme") === "dark")
  const [isView, setView] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

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
                <a href="#home" className="nav__logo"><img src={Images.logo} alt="" style={{width:"90px"}}/></a>

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
                <NavLink to={`/profile/${user._id}`}>
                <div className='profile_container'>
                <span className='user-name'>{user.fullname}</span>
                <img src={user.image ? user.image : Images.avatar} alt="" className="nav__img"/>
                </div>
                </NavLink>
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
        </div>
   );
}

export default Header;