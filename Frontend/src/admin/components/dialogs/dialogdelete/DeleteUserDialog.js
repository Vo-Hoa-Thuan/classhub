import './DeleteDialog.scss';
import axios from 'axios';
import { useState } from 'react';

function DeleteUserDialog({id, setDeleteDialog, data, setData, api_request}) {
    const [token, setToken] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
    });
    
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    
    const deleteApi = async() => {
        await axios.delete(api_request + id, {headers})
            .then((response) => {
                console.log('Xóa user thành công!');
                setDeleteDialog(false);
                setData(data.filter(user => user._id !== id));
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
    const handleConfirmDelete = async() => {
        deleteApi(); 
    }
    
    return ( 
        <div className='container-dialog-delete'>
            <div className="overlay-dialog"></div>
            <div className="dialog-delete">
                <i className='icon-cancel-delete bx bx-x' 
                onClick={() => setDeleteDialog(false)}></i>
                <div className="card-header">
                  <h5 className='text-dark'>Xác nhận xóa user</h5>
                </div>
                <p className="card-text">Bạn có chắc chắn muốn xóa user này không? Hành động này không thể hoàn tác.</p>
                <div className="dialog-action">
                  <a href="#home" onClick={handleConfirmDelete} className="btn btn-danger">Xóa</a>
                  <a href="#home" onClick={() => setDeleteDialog(false)} className="btn btn-primary">Hủy</a>
                </div>
            </div>
        </div>
     );
}

export default DeleteUserDialog;
