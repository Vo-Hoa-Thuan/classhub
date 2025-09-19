import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../api";
import Toast, { notifyError, notifySuccess } from "../../../../components/toast/Toast";
import DefaultLayout from "../../layout/default/DefaultLayout";

function Update() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [webUrl, setWebUrl] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [saleOff, setSaleOff] = useState(0);
    const [status, setStatus] = useState(true);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };
    useEffect(()=>{
        axios.get(api +`/shipping-company/${id}`)
            .then(response => {
                console.log(response.data);
                setName(response.data.name);
                setPhone(response.data.phone);
                setEmail(response.data.email);
                setImageUrl(response.data.imageUrl);
                setWebUrl(response.data.webUrl);
                setAddress(response.data.address);
                setPrice(response.data.price);
                setSaleOff(response.data.saleOff);
                setStatus(response.data.status);
            })
            .catch(error => {
            console.log(error);
            });
    },[id]);
    const company =
        {
            name: name,
            phone: phone,
            email: email,
            imageUrl: imageUrl,
            webUrl: webUrl,
            address: address,
            price: price,
            saleOff: saleOff,
            status: status
          }

    const handleUpdateShippingCompany =  async(e) =>{
        e.preventDefault();
        if(!name ||!phone ||!email ||!imageUrl ||!webUrl ||!address ||!price){
          notifyError("Thông tin không được để trống!");
        } else {
            console.log(company);
            await axios.put(api +`/shipping-company/update/${id}`, company, { headers })
            .then(response => {
              notifySuccess("Sửa thành công!");
                setTimeout(function() {
                    navigate('/admin/ship-company');
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
        }
    }
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
            <div className="row">
            <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Sửa Topic</h4>
                    <p className="card-description"> Sửa topic cho bài viết của bạn.</p>
                    <form onSubmit={handleUpdateShippingCompany} className="forms-sample">
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên công ty</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputName" 
                              value={name}
                              className="form-control" 
                              onChange={(e)=>setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputEmail">Email</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputEmail" 
                              value={email}
                              className="form-control" 
                              onChange={(e)=>setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputPhone">Điện thoại</label>
                            <div className="col-sm-9">
                              <input 
                              type="number" 
                              id="inputPhone" 
                              value={phone}
                              className="form-control" 
                              onChange={(e)=>setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputWebUrl">Website URL</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputWebUrl" 
                              value={webUrl}
                              className="form-control" 
                              onChange={(e)=>setWebUrl(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputPrice">Cước phí vận chuyện</label>
                            <div className="col-sm-9">
                              <input 
                              type="number" 
                              id="inputPrice" 
                              value={price}
                              className="form-control" 
                              onChange={(e)=>setPrice(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputSale">Sale Off</label>
                            <div className="col-sm-9">
                              <input 
                              type="number" 
                              id="inputSale" 
                              value={saleOff}
                              className="form-control" 
                              onChange={(e)=>setSaleOff(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputImage">Logo đơn vị vận chuyển</label>
                            <div className="col-sm-9">
                              <img src={imageUrl} alt={name} style={{width: '300px'}}/>
                              <input 
                              type="text" 
                              id="inputImage" 
                              value={imageUrl}
                              className="form-control mt-2" 
                              onChange={(e)=>setImageUrl(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputStatus">Hiển Thị</label>
                            <div className="col-sm-9">
                            <button id='inputStatus' className={`toggle-btn ${status ? "active" : ""}`} 
                            onClick={(e) => {e.preventDefault(); setStatus(!status);}}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group row">
                          <label htmlFor="inputAddress">Địa chỉ đơn vị (Cơ sở chính)</label>
                            <div className="col-sm-9">
                              <textarea
                              type="text" 
                              id="inputAddress" 
                              value={address}
                              className="form-control" 
                              onChange={(e)=>setAddress(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="action-form">
                          <button type="submit" className="btn btn-success">Sửa</button>
                          <Link to='/admin/ship-company' className="btn btn-light">Cancel</Link>
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

export default Update;