import { useNavigate, useParams,Link } from "react-router-dom";
import Images from "../../../assets/img/Image";
import AppsDownloaded from "../../childrencomponents/productcomponents/appdownloaded/AppsDownloaded";
import Default from "../../layout/default/Default";
import './ProfilePage.scss'
import { useEffect, useState } from "react";
import axios from "axios";
import { api} from "../../../api";
import DialogEditProfile from "../../dialogs/dialogeditprofile/DialogEditProfile";

function ProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams(); 
  const [activeDialogEdit, setActiveProfileEdit] = useState(false);
  const [appsDownloaded,setAppsDownloaded] = useState([]);
  const [orderList,setOrderList] = useState([]);
  const [orderShipping,setOrderShipping] = useState(0);
  const [dataUser, setDataUser] = useState([]);
  const [loaders, setLoaders] = useState(false);
  const [token,setToken] = useState(() => {
    const data = localStorage.getItem('token');
    return data ? data : '';
  });
  const headers = {
    token: `Bearer ${token}`,
    };
  const user = JSON.parse(localStorage.getItem('user'));
    useEffect(()=>{
      setLoaders(true);
      axios.get(api +`/order-app/user/${id}`,{headers})
          .then(response => {
            const sortedList = response.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            setAppsDownloaded(sortedList)
          })
          .catch(error => {
          console.log(error);
          });
      axios.get(api +`/order/user/${id}`,{headers})
        .then(response => {
            setOrderList(response.data)
            console.log(response.data);
            for(var i=0; i<response.data.length;i++){
              if(response.data[i].orderTracking ===5){
                setOrderShipping(prev=>prev+1);
              }
              
            }
        })
        .catch(error => {
        console.log(error);
        });
        setLoaders(false);
    },[]);
    
  const handleLogout = (e)=>{
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('order');
    localStorage.removeItem('export_order');
    navigate('/');
  }

  useEffect(()=>{
    const user = localStorage.getItem('user');
    if(!user){
        navigate('/404-page');
  }},[]);

  useEffect(() => {
    axios.get(api +`/user/${id}`,{headers})
            .then(response => {
                setDataUser(response.data)
            })
            .catch(error => {
            console.log(error);
            });
  },[activeDialogEdit]);

  useEffect(()=>{
    localStorage.removeItem('order');
    localStorage.removeItem('orderApp');
  },[]);
  const handleActiveDialogEdit = () => {
    setActiveProfileEdit(true);
  }
    return ( 
        <Default>
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
            {/* <!-- ***** Banner Start ***** --> */}
          <div className="row">
            <div className="col-lg-12">
              <div className="main-profile mode-bar">
                <div className="row">
                  <div className="col-lg-4">
                    <img src={dataUser.image ? dataUser.image : Images.default} alt="" style={{borderRadius: '23px'}}/>
                  </div>
                  <div className="col-lg-4 align-self-center">
                    <div className="main-info header-text">
                      <h4 className="title">{dataUser.fullname}</h4>
                      {user && user.blogger &&
                        <div>
                        <Link to='/blog-management' className="btn btn-primary">Quản lý bài viết</Link>
                        </div>
                      }
                      <p>Phone: <b>{dataUser.phone}</b></p>
                      <p>Email: <b>{dataUser.email}</b></p>
                      <p>Address: <b>{dataUser.address}</b></p>
                      <div className="main-border-button">
                        <Link to={`/profile/${id}`} onClick={handleActiveDialogEdit}>Sửa Thông Tin</Link>
                      </div>
                      <div className="btn-logout">
                        <a href="#" onClick={handleLogout}>Đăng Xuất</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 align-self-center">
                    <ul className="mode-page">
                      <li>Apps Downloaded <span>{appsDownloaded.length}</span></li>
                      {/* <li>Điểm Thành Viên <span>120</span></li> */}
                      <li>Đơn Hàng <span>{orderList.length}</span></li>
                      <li>Đang Giao <span>{orderShipping}</span></li>
                      <li><div className="main-border-button">
                        <Link to={`/order/${id}`}>Xem Đơn Hàng</Link>
                      </div></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- ***** Banner End ***** --> */}
          {/* <!-- ***** App Library Start ***** --> */}
          <AppsDownloaded
            userId={id}
            appsDownloaded={appsDownloaded}
          />
          {/* <!-- ***** App Library End ***** --> */}
          <DialogEditProfile
            dialogActive={activeDialogEdit}
            id={id}
            setDialogActive={setActiveProfileEdit}
          />
        </Default>
     );
}

export default ProfilePage;