import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { api_auth } from '../../../api';
import './VerifyEmail.scss';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const hasVerifiedRef = useRef(false); 

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token xác nhận không hợp lệ');
      return;
    }

    // Chỉ gọi API nếu chưa verify (sử dụng useRef)
    if (!hasVerifiedRef.current) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      setStatus('verifying');
      hasVerifiedRef.current = true; // Đánh dấu đã gọi API (sử dụng useRef)
      
      const response = await axios.get(`${api_auth}/verify-email/${token}`);
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        
        // Countdown redirect to login
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận email');
    }
  };

  const handleResendEmail = () => {
    navigate('/sign-up');
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-email-header">
          <div className="logo">
            🎓 ClassHub
          </div>
          <h1>Xác nhận Email</h1>
        </div>

        <div className="verify-email-content">
          {status === 'verifying' && (
            <div className="verifying-state">
              <div className="spinner"></div>
              <p>Đang xác nhận email của bạn...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h2>Xác nhận thành công!</h2>
              <p>{message}</p>
              <div className="countdown">
                <p>Chuyển hướng đến trang đăng nhập trong {countdown} giây...</p>
              </div>
              <Link to="/login" className="btn btn-primary">
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h2>Xác nhận thất bại</h2>
              <p>{message}</p>
              <div className="error-actions">
                <button onClick={handleResendEmail} className="btn btn-outline-primary">
                  Đăng ký lại
                </button>
                <Link to="/login" className="btn btn-primary">
                  Đăng nhập
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="verify-email-footer">
          <p>Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ.</p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
