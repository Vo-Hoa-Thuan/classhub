import './DeleteDialog.scss';
import axios from 'axios';
import { storage } from '../../../../firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';

function DeleteDialog({id,setDeleteDialog,data, setData, imageUrl,api_request}) {
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
      const headers = {
        token: `Bearer ${token}`,
        };
    const deleteApi = async() => {
        await axios.delete(api_request+id,{headers})
            .then((reponsive)=>{
                console.log('Xóa thành công!');
                setDeleteDialog(false);
                setData(data.filter(product => product._id !== id));
            })
            .catch((err)=>{
                console.log(err);
        })
    }
    const handleConfirmDelete = async() => {
        if(imageUrl){
        const imageOld = ref(storage,imageUrl);
        var deleteImageOld; 
        await deleteObject(imageOld)
        .then(()=> deleteImageOld=1)
        .catch((err)=> deleteImageOld=err);
        console.log(deleteImageOld);
        if(deleteImageOld === 1){
        deleteApi();
        }else console.log(deleteImageOld);
        } else deleteApi(); 
        
    }
    return ( 
        <div className='container-dialog-delete'>
            <div className="overlay-dialog"></div>
                <div className="dialog-delete">
                    <i className='icon-cancel-delete bx bx-x' 
                    onClick={()=> setDeleteDialog(false)}></i>
                <div className="card-header">
                  <h5 className='text-dark'>Xác nhận xóa</h5>
                </div>
                <p className="card-text">Bạn có chắc muốn xóa sản phẩm này không?</p>
                <div className="dialog-action">
                  <a href="#home" onClick={handleConfirmDelete} className="btn btn-danger">Xóa</a>
                  <a href="#home" onClick={() => setDeleteDialog(false)} className="btn btn-primary">Cancel</a>
                </div>
            </div>
        </div>
     );
}

export default DeleteDialog;