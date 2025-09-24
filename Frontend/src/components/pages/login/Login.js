import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Images from '../../../assets/img/Image';
import './Login.scss'
import authService from '../../../services/AuthService';

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [checkEmail,setCheckEmail] = useState(true);
  const [checkPassword,setCheckPassword] = useState(true);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if(email === '' || password === ''){
      alert('Thông tin không được để trống!')
      return;
    }

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        setCheckEmail(true);
        setCheckPassword(true);
        
        // Start token expiry timer
        authService.startTokenExpiryTimer();
        
        console.log('Login successful:', result);
        console.log('User data:', result.user);
        console.log('Admin status:', result.admin);
        
        if (result.admin === true) {
          navigate('/admin/dashboard');
        } else {
          navigate('/'); 
          window.location.reload();
        }
      } else {
        // Handle login errors
        if (result.error.includes('password') || result.error.includes('mật khẩu')) {
          setCheckPassword(false);
        } else if (result.error.includes('email') || result.error.includes('Email')) {
          setCheckEmail(false);
        } else {
          alert(result.error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Đã xảy ra lỗi khi đăng nhập');
    }
  }
    return ( 
      <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form" onSubmit={handleLogin}>
            <h4 className="login100-form-title">
              ĐĂNG NHẬP NGAY
            </h4>
            
            
            <div className="wrap-input100">
              <input 
              className="input100" 
              type="text" name="email" 
              placeholder='Email'
              onChange={(e)=> setEmail(e.target.value)}
              onClick={()=>setCheckEmail(true)}
              />
              {!checkEmail 
              ? <span className='check-user-text'>Email chưa chính xác!</span>
              : null
              }
            </div>
            
            <div className="wrap-input100">
              <input 
              className="input100" 
              type="password" 
              name="pass"
              placeholder='Password'
              onChange={(e)=> setPassword(e.target.value)}
              onClick={()=>setCheckPassword(true)}
              />
              {!checkPassword 
              ? <span className='check-user-text'>Mật khẩu không đúng!</span>
              : null
              }
              
            </div>

            <div className='container-checkbox'>
            <div className='remember-pw'>
            <input className="input-checkbox" id='ckrepw' type="checkbox"/>
							<label className="label-checkbox" htmlFor="ckrepw">
							Nhớ thông tin
							</label>
            </div>
            <div className='forgot-pw'>
              <NavLink to="/forgot-password" className="txt1">
								Quên mật khẩu?
							</NavLink>
            </div>
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn">
                Login
              </button>
            </div>
            <div className="text-center">
            <NavLink to='/sign-up' className="sign-up">
                <span>Đăng ký ngay </span>
            </NavLink>
              <span className="txt2">
                hoặc đăng nhập với
              </span>
            </div>
  
            <div className="login100-form-social">
              <a href="#home" className="login100-form-social-item">
              <i className='bx bxl-facebook-circle facebook-icon'></i>
              </a>
  
              <a href="#home" className="login100-form-social-item">
              <i className='bx bxl-google google-icon'></i>
              </a>
            </div>
          </form>
  
          <div className="login100-more" style={{backgroundImage: `url(${Images.banner_login})`}}>
          </div>
        </div>
      </div>
    </div>
     );
}

export default Login;