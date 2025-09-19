import axios from "axios";
import { useState } from "react";
import { api, api_auth} from "../../../api";
import { notifyError, notifySuccess } from "../../toast/Toast";

function ChangePassword({data,id}) {
    //Change Password
    const [password,setPassword] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [checkHidePass,setCheckHidePass] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
      const headers = {
        token: `Bearer ${token}`,
        };
    
    const handleChangePassword = async() =>{
        if(!password || !newPassword || !confirmPassword){
            notifyError('Thông tin không được để trống. Kiểm tra lại!')
        } else {
            const userAcc = {
                email: data.email,
                password: password.toString()
            }
            await axios.post(api_auth+'/check-password',userAcc)
            .then((response)=>{
                console.log(userAcc);
                console.log(response.data);
                if(newPassword === confirmPassword){
                    axios.put(api +`/user/update/${id}`, {password: newPassword.toString()}, {headers})
                    .then((response)=>{
                        notifySuccess('Đổi mật khẩu thành công!');
                        setPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                    })
                    .catch((error)=>{
                        notifyError('Đã có lỗi xảy ra. Thử lại sau!')
                    })
                }
                if(newPassword !== confirmPassword) notifyError('Mật mới và mật khẩu nhập lại chưa trùng nhau!')
            })
            .catch((error)=>{
                console.log(error);
                if(error.response.status===400) notifyError('Mật khẩu cũ không đúng!')
            });
        }
        
    }

    return ( 
        <div className="card-body">
            <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="form-group">
            <label htmlFor="password">Mật khẩu cũ</label>
            <input 
            value={password} 
            type={checkHidePass ? 'text' : 'password'} 
            className="form-control" id="password" 
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"/>
            </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input 
            type={checkHidePass ? 'text' : 'password'} 
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            className="form-control" 
            id="newPassword" 
            placeholder="Nhập mật khẩu mới"/>
            </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group">
            <label htmlFor="confirm">Nhập lại mật khẩu mới</label>
            <input 
            type={checkHidePass ? 'text' : 'password'}  
            className="form-control" 
            id="confirm" 
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"/>
            </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div onClick={()=>setCheckHidePass(!checkHidePass)} className="form-group">
            <input 
            type="checkbox"
            checked={checkHidePass} 
            id="checked"/>
            <label>Hiện mật khẩu.</label>
            </div>
            </div>
            </div>
            <div className="row gutters">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="text-right">
            <button onClick={handleChangePassword} type="button" id="submit" name="submit" className="btn btn-primary">Đổi Mật Khẩu</button>
            </div>
            </div>
            </div>
        </div>
     );
}

export default ChangePassword;