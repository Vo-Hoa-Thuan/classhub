import axios from "axios";
import { useEffect, useState } from "react";
import { api} from "../../../api";
import './DialogEditProfile.scss'
import Images from "../../../assets/img/Image";
import ChangePassword from "./ChangePassword";
import ChangeProfile from "./ChangeProfile";
import Toast,{notifySuccess,notifyError} from "../../toast/Toast"; 
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { v4 } from "uuid";

function DialogEditProfile({dialogActive,id,setDialogActive}) {
    const [tabChangePass,setTabChangePass] = useState(false);
    const [user,setUser] = useState();
    const [imageUrl,setImageUrl] = useState();
    const [selectedImage,setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
      });
      const headers = {
        Authorization: `Bearer ${token}`,
        };

    useEffect(() => {
        if(token && id) {
            axios.get(api +`/user/${id}`,{headers})
                    .then(response => {
                        console.log('Dữ liệu bên dialog:',response.data);
                        const userData = response.data.data || response.data;
                        if (userData) {
                            setUser(userData);
                            setImageUrl(userData.image || '');
                            // Cập nhật localStorage với thông tin user mới nhất
                            localStorage.setItem('user', JSON.stringify(userData));
                        } else {
                            console.error('User data is null or undefined');
                        }
                    })
                    .catch(error => {
                        console.log('Error loading user data in dialog:', error);
                        // Fallback: lấy user từ localStorage
                        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                        if (localUser && localUser._id) {
                            setUser(localUser);
                            setImageUrl(localUser.image || '');
                        }
                    });
        }
      },[dialogActive, token, id]);

    const uploadImage = async() => {
        try {
            setIsUploading(true);
            const imagRef = ref(storage,`images/profile-users/${selectedImage.name + v4()}`);
            await uploadBytes(imagRef, selectedImage);
            
            // Lấy URL của ảnh từ StorageRef
            const url = await getDownloadURL(imagRef);
            console.log('Image URL:', url);
            
            // Cập nhật ảnh trong database
            const response = await axios.put(api +`/user/update/${id}`, {image: url}, { headers});
            
            if (response.data.success) {
                setImageUrl(url);
                notifySuccess('Đã lưu ảnh lên cloud');
                
                // Cập nhật user state với ảnh mới
                setUser(prevUser => ({
                    ...prevUser,
                    image: url
                }));
                
                // Cập nhật localStorage
                const userLocal = JSON.parse(localStorage.getItem('user'));
                if (userLocal) {
                    userLocal.image = url;
                    localStorage.setItem('user', JSON.stringify(userLocal));
                }
            } else {
                notifyError('Có lỗi khi cập nhật ảnh trong database');
            }
        } catch (err) {
            console.error('Upload image error:', err);
            notifyError('Đã có lỗi xảy ra khi upload ảnh!');
        } finally {
            setIsUploading(false);
        }
    }
    const handleUploadImage = async(e)=>{
        e.preventDefault();
        console.log('handleUploadImage called, selectedImage:', selectedImage);
        if(selectedImage == null) return notifyError('Bạn chưa chọn ảnh mới!');
        
        try {
            // Xóa ảnh cũ nếu có
            if(imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
                try {
                    const imageOld = ref(storage, imageUrl);
                    await deleteObject(imageOld);
                    console.log('Old image deleted successfully');
                } catch (deleteErr) {
                    console.warn('Could not delete old image:', deleteErr);
                    // Tiếp tục upload ảnh mới dù không xóa được ảnh cũ
                }
            }
            
            // Upload ảnh mới
            await uploadImage();
            setSelectedImage(null);
        } catch (error) {
            console.error('Handle upload image error:', error);
            notifyError('Có lỗi xảy ra khi xử lý ảnh!');
        }
    }

return ( 
<>
{ dialogActive=== true &&
<div className="container-dialog-edit">
<div className="overlay-dialog"></div>
    <div className="row gutters dialog-edit-profile">
        <i className='icon-cancel-edit bx bx-x' 
            onClick={()=> setDialogActive(false)}></i>
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
                <div className="card-body">
                <h5 className="user-name text-pink mb-4">Đổi ảnh đại diện</h5>
                <div className="account-settings">
                <div className="user-profile">
                <div className="user-avatar">
                <img src={imageUrl ? imageUrl: Images.default} alt="Maxwell Admin"/>
                </div>
                </div>
                <div className="image-change">
                <input type="file"
                onChange={(e)=>setSelectedImage(e.target.files[0])} 
                accept=".png,.jpg,.jpeg"
                />
                <button 
                    onClick={handleUploadImage} 
                    className="btn btn-primary"
                    disabled={isUploading}
                >
                    {isUploading ? 'Đang tải lên...' : 'Lưu Ảnh'}
                </button>
                </div>
                </div>
                </div>
            </div>
        </div>
<div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
    <div className="card h-100">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="tab-control">
            <div onClick={()=>setTabChangePass(false)} className={`btn-tab-control ${!tabChangePass && 'active-btn-tab'}`}><h6 className="mb-2 text-pink">Thông tin cá nhân</h6></div>
            <div onClick={()=>setTabChangePass(true)} className={`btn-tab-control ${tabChangePass && 'active-btn-tab'}`}><h6 className="mb-2 text-pink">Đổi mật khẩu</h6></div>
            </div>
        </div>
        {/* CHANGE PASSWORD */}
        {tabChangePass ?
        <ChangePassword
            data = {user}
            id = {id}
        />
        : 
        <ChangeProfile
            data = {user}
            id={id}
            setDialogActive={setDialogActive}
        />
        }
    </div>
</div>
<Toast/>
</div>
</div>
}
</>
     );
}

export default DialogEditProfile;
