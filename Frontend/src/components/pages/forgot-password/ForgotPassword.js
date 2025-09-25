import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../../services/AuthService';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.forgotPassword(email);

      if (result.success) {
        toast.success(result.message);
        setEmail('');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form" onSubmit={handleSubmit}>
            <span className="login100-form-title">
              Quên mật khẩu
            </span>

            <div className="wrap-input100 validate-input" data-validate="Email is required">
              <input 
                className="input100" 
                type="email" 
                name="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button 
                className="login100-form-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </div>

            <div className="text-center">
              <NavLink to="/login" className="txt2">
                <i className="fa fa-long-arrow-left m-l-5" aria-hidden="true"></i>
                Quay lại đăng nhập
              </NavLink>
            </div>

            <div className="text-center mt-3">
              <NavLink to='/' className="home-link">
                <i className="fa fa-home" aria-hidden="true"></i>
                Trở về trang chủ
              </NavLink>
            </div>
          </form>

          <div className="login100-more" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/banner_login.jpg)`}}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
