import './DeleteDialog.scss';
import axios from 'axios';
import { useState } from 'react';

function DeleteUserDialog({id, setDeleteDialog, data, setData, api_request}) {
    const [token] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
    });
    
    const [deleting, setDeleting] = useState(false);
    
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    
    const deleteApi = async() => {
        setDeleting(true);
        try {
            const response = await axios.delete(api_request + id, {headers});
            console.log('Xóa user thành công!', response.data);
            
            // Hiển thị thông báo chi tiết
            const deletedData = response.data.deletedData;
            const userInfo = response.data.userInfo;
            
            alert(`✅ Xóa thành công!\n\n👤 User: ${userInfo?.name || 'N/A'}\n📧 Email: ${userInfo?.email || 'N/A'}\n📱 Phone: ${userInfo?.phone || 'N/A'}\n\n📊 Đã xóa:\n• ${deletedData?.orders || 0} đơn hàng\n• ${deletedData?.blogs || 0} bài viết\n• Tổng cộng: ${deletedData?.total || 0} dữ liệu liên quan`);
            
            setDeleteDialog(false);
            setData(data.filter(user => user._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('❌ Có lỗi xảy ra khi xóa user: ' + (err.response?.data?.message || err.message));
        } finally {
            setDeleting(false);
        }
    }
    
    const handleConfirmDelete = async() => {
        deleteApi(); 
    }
    
    return ( 
        <div className='container-dialog-delete'>
            <div className="overlay-dialog"></div>
            <div className="dialog-delete" style={{maxWidth: '500px', width: '90%'}}>
                <i className='icon-cancel-delete bx bx-x' 
                onClick={() => setDeleteDialog(false)}></i>
                <div className="card-header">
                  <h5 className='text-dark'>⚠️ Xác nhận xóa user</h5>
                </div>
                
                <div className="card-body">
                    <div className="alert alert-warning" role="alert">
                        <strong>⚠️ Cảnh báo:</strong> Hành động này sẽ xóa vĩnh viễn user và tất cả dữ liệu liên quan!
                    </div>
                    
                    <div className="mb-3">
                        <h6 className="text-danger">📋 Dữ liệu sẽ bị xóa:</h6>
                        <div className="ms-3">
                            <ul className="list-unstyled">
                                <li>👤 <strong>Thông tin cá nhân user</strong></li>
                                <li>📦 <strong>Tất cả đơn hàng</strong> (đơn hàng thường và đơn hàng app)</li>
                                <li>📝 <strong>Tất cả bài viết</strong> do user tạo</li>
                                <li>🔐 <strong>Tài khoản đăng nhập</strong></li>
                            </ul>
                        </div>
                    </div>
                    
                    <p className="card-text text-danger">
                        <strong>Bạn có chắc chắn muốn xóa user này không? Hành động này không thể hoàn tác!</strong>
                    </p>
                </div>
                
                <div className="dialog-action">
                    <button 
                        onClick={handleConfirmDelete} 
                        className="btn btn-danger"
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Đang xóa...
                            </>
                        ) : (
                            '🗑️ Xóa User & Dữ Liệu Liên Quan'
                        )}
                    </button>
                    <button 
                        onClick={() => setDeleteDialog(false)} 
                        className="btn btn-primary"
                        disabled={deleting}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
     );
}

export default DeleteUserDialog;
