import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Default from '../../layout/default/Default';
import BlogService from '../../../services/BlogService';
import { useAuth } from '../../../hooks/useAuth';
import './MyBlogsPage.scss';

function MyBlogsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserBlogs();
  }, [user, navigate]);

  const loadUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getUserBlogs();
      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Error loading user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Chờ duyệt</span>;
      case 'approved':
        return <span className="status-badge approved">Đã duyệt</span>;
      case 'rejected':
        return <span className="status-badge rejected">Bị từ chối</span>;
      default:
        return <span className="status-badge unknown">Không xác định</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Default>
        <div className="my-blogs-page">
          <div className="container">
            <div className="loading">Đang tải...</div>
          </div>
        </div>
      </Default>
    );
  }

  return (
    <Default>
      <div className="my-blogs-page">
        <div className="container">
          <div className="page-header">
            <h2>Bài viết của tôi</h2>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/blog/create')}
            >
              Viết bài mới
            </button>
          </div>

          {blogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Chưa có bài viết nào</h3>
              <p>Hãy bắt đầu viết bài viết đầu tiên của bạn!</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/blog/create')}
              >
                Viết bài ngay
              </button>
            </div>
          ) : (
            <div className="blogs-list">
              {blogs.map(blog => (
                <div key={blog._id} className="blog-card">
                  <div className="blog-header">
                    <h3 className="blog-title">{blog.title}</h3>
                    {getStatusBadge(blog.approvalStatus)}
                  </div>
                  
                  <div className="blog-meta">
                    <span className="topic">Chủ đề: {blog.topic?.title}</span>
                    <span className="date">
                      Tạo: {formatDate(blog.createdAt)}
                    </span>
                    {blog.approvedAt && (
                      <span className="approved-date">
                        Duyệt: {formatDate(blog.approvedAt)}
                      </span>
                    )}
                  </div>

                  <p className="blog-short-desc">{blog.shortDesc}</p>

                  {blog.rejectionReason && (
                    <div className="rejection-reason">
                      <strong>Lý do từ chối:</strong> {blog.rejectionReason}
                    </div>
                  )}

                  {blog.approvedBy && (
                    <div className="approval-info">
                      <strong>Duyệt bởi:</strong> {blog.approvedBy.fullname}
                    </div>
                  )}

                  <div className="blog-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => navigate(`/blog/${blog._id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Default>
  );
}

export default MyBlogsPage;
