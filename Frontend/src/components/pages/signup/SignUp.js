import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api_auth } from '../../../api';
import './SignUp.scss'
import Toast,{notifySuccess,notifyError} from "../../toast/Toast"; 

function SignUp() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [fullname,setFullName] = useState("")
  const [phone,setPhone] = useState("")
  const [birth,setBirth] = useState("")
  const [gender,setGender] = useState("")
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
                        return null;
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
    confirmPassword: confirmPassword,
    fullname: fullname,
    phone: phone,
    birth: birth,
    gender: gender,
    address: `${detailAddress}, ${commune}, ${district}, ${city}`
  }
  const handleSignup = (e)=>{
    e.preventDefault();
    
    // Validation trước khi gửi request
    if(!email ||!password ||!confirmPassword ||!fullname ||!phone ||!birth ||!gender ||!city ||!district ||!commune ||!detailAddress) {
      notifyError('Vui lòng điền đầy đủ thông tin!')
      return;
    }
    
    if(password !== confirmPassword) {
      notifyError('Mật khẩu xác nhận không khớp!')
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if(password.length < 8) {
      notifyError('Mật khẩu phải có ít nhất 8 ký tự!')
      return;
    }
    
    // Kiểm tra độ phức tạp mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if(!passwordRegex.test(password)) {
      notifyError('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!')
      return;
    }
    
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
      notifyError('Vui lòng nhập địa chỉ email hợp lệ!')
      return;
    }
    
    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{9,15}$/;
    if(!phoneRegex.test(phone)) {
      notifyError('Số điện thoại phải chứa 9-15 chữ số!')
      return;
    }
    
    // Kiểm tra tên đầy đủ
    if(fullname.length < 2) {
      notifyError('Họ tên phải có ít nhất 2 ký tự!')
      return;
    }
    
    // Kiểm tra địa chỉ
    if(detailAddress.length < 10) {
      notifyError('Địa chỉ chi tiết phải có ít nhất 10 ký tự!')
      return;
    }
    
    // Gửi request đăng ký
    axios.post(api_auth + "/register", newUser)
    .then((response) => {
      console.log('Registration success:', response.data);
      notifySuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản. Bạn có 15 phút để hoàn tất xác nhận.');
      
      // Reset form sau khi đăng ký thành công
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setPhone('');
      setBirth('');
      setGender('');
      setDetailAddress('');
      setCommune('');
      setDistrict('');
      setCity('');
      setLocationErr('');
    })
    .catch((error) => {
      console.error('Registration error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response) {
        // Server trả về lỗi
        const errorData = error.response.data;
        const statusCode = error.response.status;
        
        if (statusCode === 400) {
          // Lỗi validation hoặc business logic
          if (errorData.message) {
            // Xử lý các thông báo lỗi cụ thể từ server
            if (errorData.message.includes('Email already exists')) {
              notifyError('Email đã được đăng ký, vui lòng sử dụng email khác!');
              setLocationErr('email');
            } else if (errorData.message.includes('Phone already exists')) {
              notifyError('Số điện thoại đã được đăng ký, vui lòng sử dụng số khác!');
              setLocationErr('phone');
            } else if (errorData.message.includes('Email verification already sent')) {
              notifyError('Email xác thực đã được gửi. Vui lòng kiểm tra email hoặc đợi 15 phút để gửi lại!');
            } else if (errorData.message.includes('Password must contain')) {
              notifyError('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!');
            } else if (errorData.message.includes('Please provide a valid email')) {
              notifyError('Vui lòng nhập địa chỉ email hợp lệ!');
              setLocationErr('email');
            } else if (errorData.message.includes('Phone number must contain only digits')) {
              notifyError('Số điện thoại chỉ được chứa chữ số và có 9-15 ký tự!');
              setLocationErr('phone');
            } else if (errorData.message.includes('Full name must be at least')) {
              notifyError('Họ tên phải có ít nhất 2 ký tự!');
              setLocationErr('fullname');
            } else if (errorData.message.includes('Address must be at least')) {
              notifyError('Địa chỉ phải có ít nhất 10 ký tự!');
              setLocationErr('address');
            } else if (errorData.message.includes('Gender must be either')) {
              notifyError('Giới tính phải là "Nam" hoặc "Nữ"!');
              setLocationErr('gender');
            } else if (errorData.message.includes('Birth date cannot be in the future')) {
              notifyError('Ngày sinh không thể là ngày trong tương lai!');
              setLocationErr('birth');
            } else {
              // Thông báo lỗi mặc định từ server
              notifyError(errorData.message || 'Có lỗi xảy ra khi đăng ký!');
            }
          }
        } else if (statusCode === 500) {
          notifyError('Lỗi máy chủ! Vui lòng thử lại sau!');
        } else {
          notifyError('Có lỗi xảy ra khi đăng ký!');
        }
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        notifyError('Không thể kết nối đến máy chủ! Vui lòng kiểm tra kết nối mạng!');
      } else {
        // Lỗi khác
        notifyError('Có lỗi xảy ra! Vui lòng thử lại!');
      }
    });
  }
    return ( 
<div className="signup-container">
  <div className="signup-background">
    <div className="signup-shapes">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  </div>
  
  <div className="container signup-main-container">
    <div className="row justify-content-center">
      <div className="col-lg-12 col-xl-10">
        <div className="signup-card">
          <div className="row g-0">
            <div className="col-lg-6 signup-left">
              <div className="signup-banner">
                <div className="signup-banner-content">
                  <div className="signup-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h2>Chào mừng đến với ClassHub</h2>
                  <p>Tham gia để xem chi tiết các phần mềm và dụng cụ hỗ trợ dạy học hiệu quả .</p>
                  <div className="signup-features">
                    <div className="feature-item">
                      <i className="fas fa-graduation-cap"></i>
                      <span>Học tập hiệu quả</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-users"></i>
                      <span>Cộng đồng sôi động</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-certificate"></i>
                      <span>Phần mềm uy tín</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 signup-right">
              <div className="signup-form-container">
                <div className="signup-header">
                  <h3>Tạo tài khoản mới</h3>
                  <p>Điền thông tin để bắt đầu hành trình học tập</p>
                </div>
                
                <div className="signup-social-section">
                  <div className="divider">
                    <span>Hoặc đăng ký với</span>
                  </div>
                  <div className="social-buttons">
                    <button className="social-btn facebook-btn">
                      <i className='bx bxl-facebook'></i>
                      <span>Facebook</span>
                    </button>
                    <button className="social-btn google-btn">
                      <i className='bx bxl-google'></i>
                      <span>Google</span>
                    </button>
                  </div>
                </div>
                <form className="signup-form" onSubmit={handleSignup}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullname">
                        <i className="fas fa-user"></i>
                        Họ và Tên
                      </label>
                      <input 
                        type="text" 
                        id="fullname" 
                        className={`form-input ${locationErr === 'fullname' ? 'error' : ''}`}
                        placeholder="Nhập họ và tên của bạn"
                        value={fullname}
                        onChange={(e)=>setFullName(e.target.value)}
                        onClick={()=>setLocationErr("")}
                        required
                      />
                      {locationErr === 'fullname' && <div className="error-message">Họ tên phải có ít nhất 2 ký tự!</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        className={`form-input ${locationErr === 'email' ? 'error' : ''}`}
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        onClick={()=>setLocationErr("")}
                        required
                      />
                      {locationErr === 'email' && <div className="error-message">Email đã được đăng ký hoặc không hợp lệ!</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">
                        <i className="fas fa-phone"></i>
                        Số điện thoại
                      </label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className={`form-input ${locationErr === 'phone' ? 'error' : ''}`}
                        placeholder="0123456789"
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                        onClick={()=>setLocationErr("")}
                        required
                      />
                      {locationErr === 'phone' && <div className="error-message">Số điện thoại đã được đăng ký hoặc không hợp lệ!</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="birth">
                        <i className="fas fa-calendar"></i>
                        Ngày sinh
                      </label>
                      <input 
                        type="date" 
                        id="birth" 
                        className="form-input" 
                        onChange={(e)=>setBirth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">
                        <i className="fas fa-map-marker-alt"></i>
                        Tỉnh/Thành Phố
                      </label>
                      <select 
                        className="form-select"
                        onChange={(e)=>handleChangeCity(e.target.value)}
                        required
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {citys && citys.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="district">
                        <i className="fas fa-map-marker-alt"></i>
                        Quận/Huyện
                      </label>
                      <select 
                        className="form-select"
                        onChange={(e)=>handleChangeDistrict(e.target.value)}
                        required
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts && districts.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="commune">
                        <i className="fas fa-map-marker-alt"></i>
                        Phường/Xã
                      </label>
                      <select 
                        className="form-select"
                        onChange={(e)=>handleChangeCommunes(e.target.value)}
                        required
                      >
                        <option value="">Chọn phường/xã</option>
                        {communes && communes.map((item)=>(
                          <option key={item.code} value={item.code}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">
                        <i className="fas fa-venus-mars"></i>
                        Giới tính
                      </label>
                      <select 
                        className="form-select"
                        onChange={(e)=>setGender(e.target.value)}
                        required
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row form-row-single">
                    <div className="form-group">
                      <label htmlFor="detailAddress">
                        <i className="fas fa-home"></i>
                        Địa chỉ cụ thể
                      </label>
                      <input 
                        type="text" 
                        id="detailAddress"
                        value={detailAddress}
                        onChange={(e)=>setDetailAddress(e.target.value)}
                        className="form-input" 
                        placeholder="Số nhà, tên đường..."
                        required
                      />
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">
                        <i className="fas fa-lock"></i>
                        Mật khẩu
                      </label>
                      <input 
                        type="password" 
                        id="password" 
                        className={`form-input ${locationErr === 'password' ? 'error' : ''}`}
                        placeholder="Tối thiểu 8 ký tự"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        onClick={()=>setLocationErr("")}
                        required
                      />
                      {password.length > 0 && password.length < 8 && 
                        <div className="error-message">Mật khẩu phải có ít nhất 8 ký tự!</div>
                      }
                      {password.length >= 8 && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password) && 
                        <div className="error-message">Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!</div>
                      }
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">
                        <i className="fas fa-lock"></i>
                        Xác nhận mật khẩu
                      </label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        className={`form-input ${locationErr === 'confirmPassword' ? 'error' : ''}`}
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        onClick={()=>setLocationErr("")}
                        required
                      />
                      {confirmPassword !== password && confirmPassword.length > 0 && 
                        <div className="error-message">Mật khẩu nhập lại chưa trùng khớp!</div>
                      }
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="signup-btn">
                      <i className="fas fa-user-plus"></i>
                      Tạo tài khoản
                    </button>
                    <div className="signup-links">
                      <p>Đã có tài khoản? <NavLink to='/login' className="login-link">Đăng nhập ngay</NavLink></p>
                      <NavLink to='/' className="home-link">
                        <i className="fas fa-home"></i>
                        Về trang chủ
                      </NavLink>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast/>
</div>
     );
}

export default SignUp;
