import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { api_auth } from '../../../api';
import Images from '../../../assets/img/Image';
import './SignUp.scss'
import Toast,{notifySuccess,notifyError} from "../../toast/Toast"; 

function SignUp() {
  const navigate = useNavigate()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [fullname,setFullName] = useState("")
  const [phone,setPhone] = useState("")
  const [birth,setBirth] = useState("")
  const [gender,setGender] = useState("")
  const [error,setError] = useState("")
  const [locationErr,setLocationErr] = useState("")

  //Sate để nhận địa chỉ:
  const [detailAddress,setDetailAddress] = useState('');
  const [commune,setCommune] = useState('');
  const [district,setDistrict] = useState('');
  const [city,setCity] = useState('');

  //Api tỉnh thành VN
  const api_province_url = 'https://provinces.open-api.vn/api/?depth=1'
  const [citys, setCitys] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes,setCommunes] = useState('');

  useEffect(() => {
    axios.get(api_province_url)
            .then(response => {
                let citys = [];
                response.data.map((item)=>{
                        citys.push({
                        name: item.name,
                        code: item.code,
                        codename: item.codename
                    });
                })
                setCitys(citys);
            })
            .catch(error => {
            console.log(error);
            });
     },[]);

  const handleChangeCity = async(code)=>{
      const codeCity = code;
      const cityname = citys.filter((item) => item.code === parseInt(codeCity));
      setCity(cityname[0].name);
      await axios.get(`https://provinces.open-api.vn/api/p/${codeCity}?depth=3`)
      .then(response => {
          console.log(response.data.districts);
          setDistricts(response.data.districts);
      })
      .catch(error => {
      console.log(error);
      });
  }

  const handleChangeDistrict = async(code) =>{
      const codeDistrict = code;
      const districtname = districts.filter((item) => item.code === parseInt(codeDistrict));
      setDistrict(districtname[0].name);
      await axios.get(`https://provinces.open-api.vn/api/d/${codeDistrict}?depth=2`)
      .then(response => {
          console.log(response.data.wards);
          setCommunes(response.data.wards)
      })
      .catch(error => {
      console.log(error);
      });
  }

  const handleChangeCommunes = (code) =>{
      const codeCommunes = code;
      const communeCode = communes.filter((item) => item.code === parseInt(codeCommunes));
      setCommune(communeCode[0].name);
  }
  const newUser = {
    email: email,
    password: password,
    fullname: fullname,
    phone: phone,
    birth: birth,
    gender: gender,
    address: `${detailAddress}, ${commune}, ${district}, ${city}`
  }
  const handleSignup = (e)=>{
    e.preventDefault();
    if(!email ||!password ||!fullname ||!phone ||!birth ||!gender ||!city ||!district ||!commune ||!detailAddress) {
      notifyError('Không được để trống thông tin!')
    } else{
      axios.post(api_auth + "/register", newUser)
      .then((response) => {
        // handle successful response
        console.log(response.data);
        notifySuccess('Đăng ký mới thành công!');
        setTimeout(function() {
          navigate('/login');
        }, 2000);
        
      })
      .catch((error) => {
        // handle error response
        console.log(error.response.data);
        if (error.response.data.code === 11000 && error.response.data.keyPattern.email === 1) {
          notifyError("Email đã được đăng ký, vui lòng sử dụng email khác!")
          setLocationErr("email")
        }
        if (error.response.data.code === 11000 && error.response.data.keyPattern.phone === 1) {
          notifyError("Số điện thoại đã được đăng ký, vui lòng sử dụng số khác!")
          setLocationErr("phone")
        }
      });
    }
    
  }
    return ( 
<body className="bg-dark">
  <div className="container py-5">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col">
        <div className="card card-registration my-4">
          <div className="row g-0">
            <div className="col-xl-6 d-none d-xl-block container-bg">
              <img src={Images.banner_signup} alt='Sign Up'
                style={{borderTopLeftRadius: '.25rem', borderBottomLeftRadius: '.25rem'}}/>
                <div className='title-signup'>
                <h4>ĐĂNG KÝ NGAY</h4>
                <p>Chào mừng bạn đã đến với VNSIM. Nhanh tay đăng ký và tận hưởng nhé!</p>
                </div>
            </div>
            <div className="col-xl-6">
              <div className="card-body p-md-5 text-black">
                <h3 className="hidden-title text-uppercase">ĐĂNG KÝ NGAY</h3>
                <div className="text-center">
                    <span className="txt2">
                    Đăng ký với
                    </span>
                </div>
                <div className="signup-social">
                <a href="#facebook" className="signup-social-item">
                <i className='bx bxl-facebook-circle facebook-icon'></i>
                </a>

                <a href="#google" className="signup-social-item">
                <i className='bx bxl-google google-icon'></i>
                </a>
            </div>
                <div className="row mt-40">
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="form3Example1m">Họ và Tên</label>
                      <input 
                      type="text" 
                      id="form3Example1m" 
                      className="form-control form-control-lg" 
                      onChange={(e)=>setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="form3Example1n">Email</label>
                      <input 
                      type="text" 
                      id="form3Example1n" 
                      className="form-control form-control-lg"
                      onChange={(e)=>setEmail(e.target.value)}
                      onClick={()=>setLocationErr("")}
                      />
                      { locationErr === "email"
                      &&
                      <span className='check-user-text'>{error}</span>
                      }
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="form3Example1m1">Điện thoại</label>
                      <input 
                      type="text" 
                      id="form3Example1m1" 
                      className="form-control form-control-lg" 
                      onChange={(e)=>setPhone(e.target.value)}
                      onClick={()=>setLocationErr("")}
                      />
                      {phone?.length < 10 
                      &&
                      <span className='check-user-text'>Số điện thoại phải có 10 số!</span>
                      }
                      { locationErr === "phone"
                      &&
                      <span className='check-user-text'>{error}</span>
                      }
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-outline">
                      <label className="form-label" htmlFor="form3Example1n1">Ngày sinh</label>
                      <input 
                      type="date" 
                      id="form3Example1n1" 
                      className="form-control form-control-lg" 
                      onChange={(e)=>setBirth(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                  <div className="form-group">
                  <label htmlFor="Street">Tỉnh/Thành Phố</label>
                  <select className="form-control"
                  onChange={(e)=>handleChangeCity(e.target.value)}
                  >
                  <option>{city}</option>
                      {citys && citys.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                      ))}
                  </select>
                  </div>
                  </div>
                  <div className="col-md-6 mb-4">
                  <div className="form-group">
                  <label htmlFor="Street">Quận/Huyện</label>
                  <select className="form-control"
                  onChange={(e)=>handleChangeDistrict(e.target.value)}
                  >
                  <option>{district}</option>
                      {districts && districts.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                      ))}
                  </select>
                  </div>
                  </div>
                  <div className="col-md-6 mb-4">
                  <div className="form-group">
                  <label htmlFor="Street">Phường/Xã</label>
                  <select className="form-control"
                  onChange={(e)=>handleChangeCommunes(e.target.value)}
                  >
                  <option>{commune}</option>
                      {communes && communes.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                      ))}
                  </select>
                  </div>
                  </div>
                  <div className="col-md-6 mb-4">
                  <div className="form-group">
                  <label htmlFor="Street">Địa chị cụ thể (Số nhà, khu,...)</label>
                  <input type="text" 
                  value={detailAddress}
                  onChange={(e)=>setDetailAddress(e.target.value)}
                  className="form-control" 
                  id="Street" placeholder="Nhập số nhà..."/>
                  </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label label-gender" htmlFor="formGender">Giới tính</label>
                    <select className="select combo-gender" onChange={(e)=>setGender(e.target.value)}>
                      <option>Chọn</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example9">Mật khẩu</label>
                  <input 
                  type="text" 
                  id="form3Example9" 
                  className="form-control form-control-lg" 
                  onChange={(e)=>setPassword(e.target.value)}
                  />
                  {password.length < 6 
                  &&
                  <span className='check-user-text'>Mật khẩu phải có ít nhất 6 ký tự!</span>
                  }
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example90">Nhập lại mật khẩu</label>
                  <input 
                  type="text" 
                  id="form3Example90" 
                  className="form-control form-control-lg" 
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword !== password && <span className='check-user-text'>Mật khẩu nhập lại chưa trùng khớp!</span>}
                </div>

                <div className="container-btn-signup">
                <button onClick={handleSignup} className="signup-btn mb-4">Đăng Ký</button><br></br>
                <NavLink to='/login' className="text-dark">Về đăng nhập</NavLink>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast/>
</body>
     );
}

export default SignUp;