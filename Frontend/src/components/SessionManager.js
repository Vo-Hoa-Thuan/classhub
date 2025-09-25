import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './SessionManager.scss';

const SessionManager = () => {
    const { sessions, getUserSessions, logoutAllSessions } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        setLoading(true);
        try {
            await getUserSessions();
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tất cả thiết bị?')) {
            setLoading(true);
            try {
                await logoutAllSessions();
                window.location.href = '/login';
            } catch (error) {
                console.error('Failed to logout all sessions:', error);
                alert('Có lỗi xảy ra khi đăng xuất');
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getDeviceInfo = (userAgent) => {
        if (!userAgent) return 'Unknown Device';
        
        // Simple device detection
        if (userAgent.includes('Mobile')) return 'Mobile Device';
        if (userAgent.includes('Tablet')) return 'Tablet';
        if (userAgent.includes('Windows')) return 'Windows PC';
        if (userAgent.includes('Mac')) return 'Mac';
        if (userAgent.includes('Linux')) return 'Linux PC';
        return 'Desktop';
    };

    if (loading) {
        return (
            <div className="session-manager">
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="session-manager">
            <div className="session-header">
                <h3>Quản lý phiên đăng nhập</h3>
                <p>Quản lý các thiết bị đã đăng nhập vào tài khoản của bạn</p>
            </div>

            <div className="sessions-list">
                {sessions.length === 0 ? (
                    <div className="no-sessions">
                        <p>Không có phiên đăng nhập nào</p>
                    </div>
                ) : (
                    sessions.map((session, index) => (
                        <div key={index} className="session-item">
                            <div className="session-info">
                                <div className="device-info">
                                    <span className="device-icon">📱</span>
                                    <div>
                                        <h4>{getDeviceInfo(session.userAgent)}</h4>
                                        <p className="ip-address">IP: {session.ipAddress || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="session-details">
                                    <p className="last-used">
                                        Lần cuối: {formatDate(session.lastUsedAt)}
                                    </p>
                                    <p className="created">
                                        Tạo lúc: {formatDate(session.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="session-status">
                                <span className="status active">Đang hoạt động</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {sessions.length > 0 && (
                <div className="session-actions">
                    <button 
                        className="btn btn-danger"
                        onClick={handleLogoutAll}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng xuất tất cả thiết bị'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SessionManager;
