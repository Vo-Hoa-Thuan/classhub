import { useEffect, useState } from "react";
import { deleteObject, getDownloadURL, ref,uploadBytes } from 'firebase/storage';
import { Link, useNavigate, useParams } from "react-router-dom";
import {v4} from 'uuid';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../../../firebase';

import DefaultLayout from "../../layout/default/DefaultLayout";
import './CrudBanner.scss';
import axios from "axios";
import { api} from "../../../../api";
import Toast,{notifySuccess, notifyError} from "../../../../components/toast/Toast";


function UpdateBanner() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState('');
    const [textHighlight, setTextHighlight] = useState('');
    const [desc, setDesc] = useState('');
    const [textBtn, setTextBtn] = useState('Xem ngay');
    const [imageUrl, setImageUrl] = useState();
    const [selectedImage, setSelectedImage] = useState(null);
    const [position, setPosition] = useState();
    const [offBanner, setOffBanner] = useState(false);
    const [linkBanner, setLinkBanner] = useState('');
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : [];
    });
    const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        axios.get(api +`/banner/${id}`)
            .then(response => {
                console.log(response.data);
                setName(response.data.name);
                setTextHighlight(response.data.textHighLight);
                setDesc(response.data.desc);
                setTextBtn(response.data.textBtn);
                setImageUrl(response.data.imageUrl);
                setPosition(response.data.position);
                setOffBanner(response.data.offBanner);
                setLinkBanner(response.data.linkBanner);
            })
            .catch(error => {
            console.log(error);
            });
    },[]);
    const banner = {
        name: name,
        textHighLight: textHighlight,
        desc: desc,
        textBtn: textBtn,
        imageUrl: imageUrl,
        position: position,
        offBanner: offBanner,
    }
    const uploadImage= async() => {
      const imagRef = ref(storage,`images/banners/${selectedImage.name + v4()}`);
          await uploadBytes(imagRef, selectedImage)
          .then(()=>{
            // Lấy URL của ảnh từ StorageRef
            getDownloadURL(imagRef)
            .then((url) => {
                console.log(url); // In URL của ảnh ra console
                setImageUrl(url);
                axios.put(api +`/banner/update/${id}`, {imageUrl: url}, { headers })
                .then(response => {
                    notifySuccess('Ảnh đã được lưu!');
                })
                .catch(error => {
                console.log(error);
                notifyError('Đã có lỗi xảy ra. Thử lại sau!');
                });
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err)=>{
          console.log(err);
        })
    }
    const handleChangeImage = async(e) =>{
        e.preventDefault();
        if(selectedImage == null) {
            notifyError('Bạn chưa chọn ảnh mới!');
        }
        if(imageUrl) {
        const imageOld = ref(storage,imageUrl);
        var deleteImageOld; 
        await deleteObject(imageOld)
        .then(()=> deleteImageOld=1)
        .catch((err)=> deleteImageOld=err);
        console.log(deleteImageOld);
        if(deleteImageOld === 1){
          uploadImage();
        } else console.log(deleteImageOld);
        } else uploadImage()
    }

    const handleUpdateBanner =  async(e) =>{
        e.preventDefault();
        if( !name ||!imageUrl ||!position||!textBtn||!desc){
            notifyError('Thông tin không được để trống!');
        } else {
            console.log(banner);
            await axios.put(api +`/banner/update/${id}`, banner, { headers })
            .then(response => {
                notifySuccess('Sửa banner thành công!');
                setTimeout(function() {
                    navigate('/admin/banner');
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
        }
    }
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
            <div className="row">
            <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Sửa Banner</h4>
                    <p className="card-description"> Sửa banner cho website của bạn.</p>
                    <form onSubmit={handleUpdateBanner} className="forms-sample">
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên Banner</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputName" 
                              value={name}
                              className="form-control" 
                              onChange={(e)=>setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputTextHL">Text Highlight</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputTextHL" 
                              value={textHighlight}
                              className="form-control" 
                              onChange={(e)=>setTextHighlight(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputVideoUrl">Title Button</label>
                            <div className="col-sm-9">
                              <input type="text" id="inputVideoUrl" 
                              className="form-control"
                              value={textBtn} 
                              onChange={(e)=>setTextBtn(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputVideoUrl">Link Banner</label>
                            <div className="col-sm-9">
                              <input type="text" id="inputVideoUrl" 
                              className="form-control"
                              value={linkBanner} 
                              onChange={(e)=>setLinkBanner(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                            <label htmlFor="inputCategory">Vị Trí Banner</label>
                            <div className="col-sm-9">
                                <select className="form-control" id="inputCategory" 
                                onChange={(e) =>{setPosition(e.target.value)}}
                                value={position}
                                >
                                <option value="Top">Top</option>
                                <option value="Middle">Middle</option>
                                <option value="Bottom">Bottom</option>
                                </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                        <label htmlFor="inputDesc">Mô Tả Banner</label>
                        <textarea value={desc} 
                        onChange={(e)=>setDesc(e.target.value)}
                        className="form-control"
                        ></textarea>
                      </div>
                        </div>
                      </div>
                      <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                            <label>Tải Ảnh Banner</label><br></br>
                                <img src={imageUrl || 
                                'https://firebasestorage.googleapis.com/v0/b/uploadingvnsim.appspot.com/o/images%2FR.jpg?alt=media&token=6ff3f044-a8ea-42f3-a30e-0475583c9477'} 
                                alt="Selected" 
                                className="img-add-preview" />
                                <input type="file" 
                                accept=".png,.jpg,.jpeg"
                                onChange={(e)=>setSelectedImage(e.target.files[0])} 
                                className="file-upload-default"/>
                                <div className="input-group col-xs-12 mt-2">
                            <span className="input-group-append">
                            <button onClick={handleChangeImage} className="btn btn-primary" type="button">Upload</button>
                            <p className="text-small">*Vui lòng click Upload để lưu ảnh. <br></br>Chọn ảnh với kích thước là 2x3 để có kết quả tốt nhất! </p>
                          </span>
                        </div>
                      </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputStatus">Hiển Thị Banner</label>
                            <div className="col-sm-9">
                            <button className={`toggle-btn ${offBanner ? "" : "active"}`} onClick={(e) => {e.preventDefault(); setOffBanner(!offBanner);}}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="action-form">
                          <button type="submit" className="btn btn-success">Sửa</button>
                          <Link to='/admin/product' className="btn btn-light">Cancel</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <Toast/>
        </DefaultLayout>
     );
}

export default UpdateBanner;