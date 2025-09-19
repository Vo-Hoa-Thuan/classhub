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
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
      const headers = {
        token: `Bearer ${token}`,
        };

    useEffect(() => {
        axios.get(api +`/user/${id}`,{headers})
                .then(response => {
                    console.log('Dữ liệu bên dialog:',response.data);
                    setUser(response.data);
                    setImageUrl(response.data.image);
                })
                .catch(error => {
                console.log(error);
                });
      },[dialogActive]);

    const uploadImage = async() => {
        const imagRef = ref(storage,`images/profile-users/${selectedImage.name + v4()}`);
            await uploadBytes(imagRef, selectedImage)
            .then(()=>{
              // Lấy URL của ảnh từ StorageRef
              getDownloadURL(imagRef)
              .then((url) => {
                  console.log(url); // In URL của ảnh ra console
                  setImageUrl(url);
                  axios.put(api +`/user/update/${id}`, {image: url}, { headers})
                  notifySuccess('Đã lưu ảnh lên cloud');
                  const userLocal = JSON.parse(localStorage.getItem('user'));
                  userLocal.image = url;
                  localStorage.setItem('user',JSON.stringify(userLocal));
              })
              .catch((err) => {
                  console.log(err);
                  notifyError('Đã có lỗi xảy ra!');
              });
          })
          .catch((err)=>{
            console.log(err);
            notifyError('Đã có lỗi xảy ra!');
          })
      }
    const handleUploadImage = async(e)=>{
        e.preventDefault();
        //notifySuccess('Đã lưu ảnh thành công!')
        if(selectedImage == null) return notifyError('Bạn chưa chọn ảnh mới!');
        if(imageUrl) {
        const imageOld = ref(storage,imageUrl);
        var deleteImageOld; 
        await deleteObject(imageOld)
        .then(()=> deleteImageOld=1)
        .catch((err)=> deleteImageOld=err);
        console.log(deleteImageOld);
        if(deleteImageOld === 1){
            uploadImage();
            setSelectedImage(null);
        } else console.log(deleteImageOld);
        } else {
            uploadImage();
            setSelectedImage(null);
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
                <button onClick={handleUploadImage} className="btn btn-primary">Lưu Ảnh</button>
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