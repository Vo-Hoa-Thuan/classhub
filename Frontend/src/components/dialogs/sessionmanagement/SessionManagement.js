import React, { useState, useEffect } from 'react';
import authService from '../../../services/AuthService';
import './SessionManagement.scss';

function SessionManagement({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await authService.getSessions();
      if (result.success) {
        setSessions(result.data || []);
      } else {
        setError(result.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Load sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị?')) {
      try {
        await authService.logoutAll();
        onClose();
        window.location.href = '/login';
      } catch (err) {
        console.error('Logout all error:', err);
        alert('Có lỗi xảy ra khi đăng xuất tất cả sessions');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return 'Unknown Device';
    
    if (userAgent.includes('Mobile')) {
      return '📱 Mobile Device';
    } else if (userAgent.includes('Tablet')) {
      return '📱 Tablet';
    } else if (userAgent.includes('Windows')) {
      return '💻 Windows PC';
    } else if (userAgent.includes('Mac')) {
      return '💻 Mac';
    } else if (userAgent.includes('Linux')) {
      return '💻 Linux';
    } else {
      return '💻 Desktop';
    }
  };

  const isCurrentSession = (session) => {
    const currentRefreshToken = authService.getRefreshToken();
    return session.token === currentRefreshToken;
  };

  if (!isOpen) return null;

  return (
    <div className="session-management-overlay">
      <div className="session-management-modal">
        <div className="session-management-header">
          <h3>Quản lý Sessions</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="session-management-content">
          {loading ? (
            <div className="loading">
              <i className="bx bx-loader-alt bx-spin"></i>
              <span>Đang tải sessions...</span>
            </div>
          ) : error ? (
            <div className="error">
              <i className="bx bx-error"></i>
              <span>{error}</span>
              <button onClick={loadSessions} className="retry-btn">
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <div className="session-info">
                <p>Bạn đang đăng nhập trên <strong>{sessions.length}</strong> thiết bị</p>
              </div>

              <div className="sessions-list">
                {sessions.map((session, index) => (
                  <div 
                    key={index} 
                    className={`session-item ${isCurrentSession(session) ? 'current' : ''}`}
                  >
                    <div className="session-icon">
                      {isCurrentSession(session) ? (
                        <i className="bx bx-check-circle"></i>
                      ) : (
                        <i className="bx bx-devices"></i>
                      )}
                    </div>
                    
                    <div className="session-details">
                      <div className="session-device">
                        {getDeviceInfo(session.userAgent)}
                        {isCurrentSession(session) && (
                          <span className="current-badge">Thiết bị hiện tại</span>
                        )}
                      </div>
                      
                      <div className="session-info-text">
                        <div className="session-ip">
                          <i className="bx bx-map"></i>
                          IP: {session.ipAddress || 'Unknown'}
                        </div>
                        
                        <div className="session-time">
                          <i className="bx bx-time"></i>
                          Đăng nhập: {formatDate(session.createdAt)}
                        </div>
                        
                        {session.lastUsedAt && (
                          <div className="session-last-used">
                            <i className="bx bx-history"></i>
                            Hoạt động cuối: {formatDate(session.lastUsedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="session-actions">
                <button 
                  className="logout-all-btn"
                  onClick={handleLogoutAll}
                >
                  <i className="bx bx-log-out"></i>
                  Đăng xuất tất cả thiết bị
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SessionManagement;
