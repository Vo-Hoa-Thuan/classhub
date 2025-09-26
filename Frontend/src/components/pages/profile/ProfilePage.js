import { useNavigate, useParams,Link } from "react-router-dom";
import Images from "../../../assets/img/Image";
import AppsDownloaded from "../../childrencomponents/productcomponents/appdownloaded/AppsDownloaded";
import Default from "../../layout/default/Default";
import './ProfilePage.scss'
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { api} from "../../../api";
import DialogEditProfile from "../../dialogs/dialogeditprofile/DialogEditProfile";
import { useAuth } from "../../../hooks/useAuth";

function ProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams(); 
  const [activeDialogEdit, setActiveProfileEdit] = useState(false);
  const [appsDownloaded,setAppsDownloaded] = useState([]);
  const [orderList,setOrderList] = useState([]);
  const [orderShipping,setOrderShipping] = useState(0);
  const [dataUser, setDataUser] = useState([]);
  const [loaders, setLoaders] = useState(false);
  const [token] = useState(() => {
    const data = localStorage.getItem('accessToken');
    return data ? data : '';
  });
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token}`,
  }), [token]);
  const { user, logout } = useAuth();
  
  // Nếu không có ID trong URL, redirect đến profile của user hiện tại
  useEffect(() => {
    if (!id && user && user._id) {
      navigate(`/profile/${user._id}`, { replace: true });
    }
  }, [id, user, navigate]);

  

  // Memoized image URL - lấy từ user (localStorage) vì API không trả về image
  const imageUrl = useMemo(() => {
    if (user && user.image) {
      const result = (user.image);
      return result;
    }
    return Images.default;
  }, [user]); 

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
    },[headers, id]);
    
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      localStorage.removeItem('order');
      localStorage.removeItem('export_order');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('order');
      localStorage.removeItem('export_order');
      navigate('/');
    }
  }

  useEffect(()=>{
    const user = localStorage.getItem('user');
    if(!user){
        navigate('/404-page');
  }},[navigate]);

  useEffect(() => {
    // Nếu có ID trong URL, lấy thông tin user theo ID
    // Nếu không có ID, lấy thông tin user hiện tại từ /auth/me
    const endpoint = id ? `/user/${id}` : `/auth/me`;
    axios.get(api + endpoint, {headers})
            .then(response => {
                console.log('User data response:', response.data);
                setDataUser(response.data.data || response.data)
            })
            .catch(error => {
            console.log('Error loading user data:', error);
            });
  },[activeDialogEdit, headers, id]);

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
                    <img 
                      src={imageUrl} 
                      alt="Avatar" 
                      style={{
                        borderRadius: '23px',
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block',
                        margin: '0 auto'
                      }}
                      onError={(e) => {
                        console.log('=== IMAGE ERROR DEBUG ===');
                        console.log('Image load error:', e);
                        console.log('Failed URL:', e.target.src);
                        console.log('imageUrl from state:', imageUrl);
                        console.log('dataUser.image original:', dataUser.image);
                        console.log('=== END IMAGE ERROR ===');
                        e.target.src = Images.default;
                      }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
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
                      <div className="main-border-button" style={{marginTop: '10px'}}>
                        <Link to="/sessions">Quản lý phiên đăng nhập</Link>
                      </div>
                      <div className="btn-logout">
                        <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer'}}>Đăng Xuất</button>
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
