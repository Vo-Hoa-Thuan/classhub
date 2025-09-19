import { useState } from 'react';
import './Header.scss'
import { useNavigate } from 'react-router-dom';
import DialogEditProfile from '../../../../components/dialogs/dialogeditprofile/DialogEditProfile';

function Header({activeSideBar,setActiveSideBar}) {
    const navigate = useNavigate();
    const [user,setUser] = useState(()=>{
        const data = JSON.parse(localStorage.getItem('user'));
        return data ? data : [];
    });
    const [showMenuProfile,setMenuProfile] = useState(false);
    const [activeDialogEdit, setActiveProfileEdit] = useState(false);

    const handleHiddenSidebar = (e)=>{
        e.preventDefault();
        setActiveSideBar(!activeSideBar);
    }
    const handleMenuProfile = (e) =>{
        e.preventDefault();
        setMenuProfile(!showMenuProfile);
    }

    const handleLogOut = ()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }
    const handleActiveDialogEdit = () => {
        setActiveProfileEdit(true);
    }
    return ( 
       <>
            <nav className="navbar navbar-expand sticky-top px-4 py-0">
                    <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
                        <h2 className="text-primary mb-0"><i className="fa fa-user-edit"></i></h2>
                    </a>
                    <a href="#home" className="sidebar-toggler" onClick={handleHiddenSidebar}>
                        <i className="fa fa-bars"></i>
                    </a>
                    <form className="search-admin d-none d-md-flex ms-4">
                        <input className="form-control border-0" type="search" placeholder="Search"/>
                    </form>
                    <div className="navbar-nav align-items-center ms-auto">
                        
                        <div className="nav-item">
                            <a href="#" className="nav-link" onClick={handleMenuProfile}>
                                <img className="rounded-circle me-lg-2" src={user && user.image} alt={user && user.fullname} style={{width: '40px', height: '40px'}}/>
                                <span className="d-none d-lg-inline-flex">{user && user.fullname}<i className='bx bx-chevron-down'></i></span>
                            </a>
                            <div className={`dropdown-setting ${showMenuProfile ? 'show-dropsetting' :''}`}>
                                <a href="#profile" onClick={handleActiveDialogEdit} className="setting-item"><i className='bx bxs-user'></i>My Profile</a>
                                <a href="#setting" className="setting-item"><i className='bx bx-cog'></i>Settings</a>
                                <a href="#logout" onClick={handleLogOut} className="setting-item"><i className='bx bxs-log-in'></i>Log Out</a>
                            </div>
                        </div>
                        
                        <div className="nav-item">
                        <i className='bx bxs-sun'></i>
                        {/* <i className='bx bxs-moon' ></i> */}
                        </div>
                    </div>
                </nav>
            <DialogEditProfile
            dialogActive={activeDialogEdit}
            id={user && user._id}
            setDialogActive={setActiveProfileEdit}
          />
       </>
     );
}

export default Header;