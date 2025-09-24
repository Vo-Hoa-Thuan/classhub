import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../../services/AuthService';
import './ResetPassword.scss';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const result = await authService.verifyResetToken(token);
        if (result.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    return {
      isValid: minLength && hasLower && hasUpper && hasNumber && hasSpecial,
      errors: {
        minLength: !minLength ? 'Mật khẩu phải có ít nhất 8 ký tự' : null,
        hasLower: !hasLower ? 'Mật khẩu phải có ít nhất 1 chữ thường' : null,
        hasUpper: !hasUpper ? 'Mật khẩu phải có ít nhất 1 chữ hoa' : null,
        hasNumber: !hasNumber ? 'Mật khẩu phải có ít nhất 1 số' : null,
        hasSpecial: !hasSpecial ? 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (@$!%*?&)' : null
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { newPassword, confirmPassword } = formData;

    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      const firstError = Object.values(passwordValidation.errors).find(error => error !== null);
      toast.error(firstError);
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.resetPassword(token, newPassword);

      if (result.success) {
        toast.success(result.message);
        navigate('/login');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (tokenValid === null) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-form">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Đang kiểm tra...</span>
                </div>
                <p className="mt-3">Đang kiểm tra token...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (tokenValid === false) {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-form">
              <span className="login100-form-title text-danger">
                Token không hợp lệ
              </span>
              <div className="text-center">
                <i className="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
                <p>Vui lòng yêu cầu link mới.</p>
                <NavLink to="/forgot-password" className="btn btn-primary">
                  <i className="fa fa-refresh mr-2"></i>
                  Yêu cầu link mới
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form" onSubmit={handleSubmit}>
            <span className="login100-form-title">
              Đặt lại mật khẩu
            </span>

            <div className="wrap-input100 validate-input" data-validate="Mật khẩu mới là bắt buộc">
              <input 
                className="input100" 
                type={showPassword ? 'text' : 'password'} 
                name="newPassword" 
                placeholder="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <span 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Xác nhận mật khẩu là bắt buộc">
              <input 
                className="input100" 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword" 
                placeholder="Xác nhận mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <span 
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </span>
            </div>

            {/* Password requirements */}
            <div className="password-requirements">
              <h6>Yêu cầu mật khẩu:</h6>
              <ul>
                <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                  <i className={`fa ${formData.newPassword.length >= 8 ? 'fa-check' : 'fa-times'}`}></i>
                  Ít nhất 8 ký tự
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'valid' : ''}>
                  <i className={`fa ${/[a-z]/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                  Có chữ thường
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                  <i className={`fa ${/[A-Z]/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                  Có chữ hoa
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'valid' : ''}>
                  <i className={`fa ${/\d/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                  Có số
                </li>
                <li className={/[@$!%*?&]/.test(formData.newPassword) ? 'valid' : ''}>
                  <i className={`fa ${/[@$!%*?&]/.test(formData.newPassword) ? 'fa-check' : 'fa-times'}`}></i>
                  Có ký tự đặc biệt (@$!%*?&)
                </li>
              </ul>
            </div>

            <div className="container-login100-form-btn">
              <button 
                className="login100-form-btn" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </div>

            <div className="text-center">
              <NavLink to="/login" className="txt2">
                <i className="fa fa-long-arrow-left m-l-5" aria-hidden="true"></i>
                Quay lại đăng nhập
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

export default ResetPassword;
