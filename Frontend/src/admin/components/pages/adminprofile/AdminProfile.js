import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/default/DefaultLayout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../../../api";
import { storage } from "../../../../firebase";
import { v4 } from "uuid";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Toast, { notifyError, notifySuccess } from "../../../../components/toast/Toast";
import Images from "../../../../assets/img/Image";
import ChangePassword from "../../../../components/dialogs/dialogeditprofile/ChangePassword";
import ChangeProfile from "../../../../components/dialogs/dialogeditprofile/ChangeProfile";

function AdminProfile() {
    const {id} = useParams();
    const [tabChangePass,setTabChangePass] = useState(false);
    const [user,setUser] = useState();
    const [imageUrl,setImageUrl] = useState();
    const [selectedImage,setSelectedImage] = useState(null);
    const [checkUpdate,setCheckUpdate] = useState(false);
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
                    console.log('Dữ liệu user:',response.data);
                    setUser(response.data);
                    setImageUrl(response.data.image);
                })
                .catch(error => {
                console.log(error);
                });
      },[]);

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
                  setCheckUpdate(!checkUpdate);
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
        <DefaultLayout>
        
        </DefaultLayout>
     );
}

export default AdminProfile;