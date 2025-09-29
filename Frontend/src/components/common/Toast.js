import React, { useState, useEffect } from 'react';
import './Toast.scss';

const Toast = ({ message, type = 'info', duration = 5000, onClose, showResend = false, onResend, isResending = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  if (!message) return null;

  return (
    <div className={`toast-container ${isVisible ? 'show' : ''}`}>
      <div className={`toast toast-${type}`}>
        <div className="toast-content">
          <div className="toast-icon">
            {type === 'warning' && <i className="fa fa-exclamation-triangle"></i>}
            {type === 'success' && <i className="fa fa-check-circle"></i>}
            {type === 'error' && <i className="fa fa-times-circle"></i>}
            {type === 'info' && <i className="fa fa-info-circle"></i>}
          </div>
          <div className="toast-message">
            <div className="toast-title">
              {type === 'warning' && '⚠️ Tài khoản chưa được xác nhận'}
              {type === 'success' && '✅ Thành công'}
              {type === 'error' && '❌ Lỗi'}
              {type === 'info' && 'ℹ️ Thông tin'}
            </div>
            <div className="toast-description">{message}</div>
            {type === 'warning' && (
              <div className="toast-steps">
                <p><strong>Để tiếp tục, vui lòng:</strong></p>
                <ul>
                  <li>Kiểm tra hộp thư email (bao gồm Spam/Junk)</li>
                  <li>Tìm email từ ClassHub "Xác nhận tài khoản"</li>
                  <li>Nhấp vào liên kết xác nhận trong email</li>
                  <li>Quay lại đây và đăng nhập lại</li>
                </ul>
              </div>
            )}
          </div>
          <div className="toast-actions">
            {showResend && onResend && (
              <button 
                className="toast-btn-resend"
                onClick={onResend}
                disabled={isResending}
              >
                <i className="fa fa-paper-plane"></i>
                {isResending ? 'Đang gửi...' : 'Gửi lại'}
              </button>
            )}
            <button className="toast-btn-close" onClick={handleClose}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
