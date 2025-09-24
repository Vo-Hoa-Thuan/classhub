import { useEffect, useState } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import "./Default.scss"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_auth} from "../../../../api";
import SideBarMenu from "../header/SidebarMenu";

function DefaultLayout({children, childrenKey}) {
    const navigate = useNavigate();
    const [activeSideBar, setActiveSideBar] = useState(true);
    const [token] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : [];
      });
    useEffect(()=>{
    if(localStorage.getItem('accessToken')){
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        axios.post(api_auth+'/check-admin',null,{headers})
        .then(response => {
        console.log('checktoken:',response.status);
        })
        .catch(error => {
        console.log(error);
        console.log('Error:',error.response?.status)
        if(error.response?.status===401 || error.response?.status===403){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            navigate('/404-page');
        }
        });
    }
    else{
     navigate('/404-page');
    }
    },[token, navigate])
    return ( 
        <div className="container-fluid position-relative d-flex p-0">
        {/* <!-- Sidebar Start --> */}
        <SideBarMenu
            activeSideBar={activeSideBar}
        />

        {/* <!-- Content Start --> */}
        <div className={`content-admin ${!activeSideBar && 'full-content'}`} id="contentAdmin">
            {/* <!-- Navbar Start --> */}
            <Header
                activeSideBar={activeSideBar}
                setActiveSideBar={setActiveSideBar}
            />
            <div className="container-fluid pt-4 px-4">
            {/* Content */}
            {children}
            </div>
            {/* <!-- Footer Start --> */}
            <Footer></Footer>
        </div>
    </div>
     );
}

export default DefaultLayout;
