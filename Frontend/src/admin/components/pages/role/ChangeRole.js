import { Link, useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../layout/default/DefaultLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../../api";
import Toast,{notifySuccess} from "../../../../components/toast/Toast";

function ChangeRole() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [image, setImage] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [admin, setAdmin] = useState(false);
    const [blogger, setBlogger] = useState(false);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };
    useEffect(()=>{
        axios.get(api +`/user/${id}`,{headers})
            .then(response => {
                console.log(response.data);
                setImage(response.data.image)
                setFullname(response.data.fullname)
                setEmail(response.data.email)
                setPhone(response.data.phone)
                setAdmin(response.data.admin)
                setBlogger(response.data.blogger)
            })
            .catch(error => {
            console.log(error);
            });
    },[]);
    const userRole = {
      admin: admin,
      blogger: blogger,
  }

  const handelChangeAdmin = (e) =>{
    e.preventDefault();
    if(blogger){
        if(!admin){
        setAdmin(true);
        setBlogger(false);
        }
        admin && setAdmin(false);
    }
    if(!blogger ){
        setAdmin(!admin); 
    }
    
  }

  const handelChangeBlogger = (e) =>{
    e.preventDefault();
    if(admin){
        if(!blogger){
        setBlogger(true);
        setAdmin(false);
        }
        blogger && setBlogger(false);
    }
    if(!admin ){
        setBlogger(!blogger); 
    }
    
  }

    const handleChangeRole =  async(e) =>{
        e.preventDefault();
            await axios.put(api +`/user/update/${id}`, userRole, { headers })
            .then(response => {
              notifySuccess("Phân quyền thành công!");
                setTimeout(function() {
                    navigate('/admin/role');
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
        }
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
            <div className="row">
            <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Phân Quyền</h4>
                    <p className="card-description"> Phân quyền cho tài khoản.</p>
                    <form onSubmit={handleChangeRole} className="forms-sample">
                    <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row">
                            <label>Ảnh đại diện</label><br></br>
                                <img src={image || 
                                'https://firebasestorage.googleapis.com/v0/b/uploadingvnsim.appspot.com/o/images%2FR.jpg?alt=media&token=6ff3f044-a8ea-42f3-a30e-0475583c9477'} 
                                alt="Selected" 
                                className="img-add-preview" />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên người dùng</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputName" 
                              value={fullname}
                              className="form-control" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputVideoUrl">Email</label>
                            <div className="col-sm-9">
                              <input type="text" id="inputVideoUrl" 
                              className="form-control"
                              value={email} 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputVideoUrl">Điện thoại</label>
                            <div className="col-sm-9">
                              <input type="text" id="inputVideoUrl" 
                              className="form-control"
                              value={phone} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <h5 className="text-dark">Phân loại quyền</h5>
                      <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputStatus">Quyền Admin</label>
                            <div className="col-sm-9">
                            <button className={`toggle-btn ${admin ? "active" : ""}`} 
                            onClick={handelChangeAdmin}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputStatus">Quyền Blogger</label>
                            <div className="col-sm-9">
                            <button className={`toggle-btn ${blogger ? "active" : ""}`} 
                            onClick={handelChangeBlogger}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="action-form">
                          <button type="submit" className="btn btn-success">Phân quyền</button>
                          <Link to='/admin/role' className="btn btn-light">Cancel</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <Toast/>
        </DefaultLayout>
     );
}

export default ChangeRole;