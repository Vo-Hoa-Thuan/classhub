import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import { deleteObject, getDownloadURL, list, ref,uploadBytes} from 'firebase/storage';
import {v4} from 'uuid';
import 'react-quill/dist/quill.snow.css';
import { Link, useParams,useNavigate } from "react-router-dom";
import { storage } from '../../../../firebase';

import DefaultLayout from "../../layout/default/DefaultLayout";
import './CrudProduct.scss';
import { modules } from "../../childrencomponents/texteditor/TextEditorCustom";
import axios from "axios";
import { api } from "../../../../api";
import Toast,{notifySuccess, notifyError} from "../../../../components/toast/Toast";

function UpdateProduct() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [imagesSubOld, setImagesSubOld] = useState('');
    const [imagesSub, setImagesSub] = useState('');
    const [imageSubSelecte,setImageSubSelecte] = useState(null);
    const [vieoURL, setVideoURL] = useState('');
    const [price, setPrice] = useState(0);
    const [saleOff, setSaleOff] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [software, setSoftware] = useState();
    const [linkDownload, setLinkDownload] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState();
    const navigate = useNavigate();
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : [];
    });
    const headers = {
      token: `Bearer ${token}`,
      };
      
    useEffect(()=>{
        axios.get(api +`/product/admin/${id}`,{headers})
            .then(response => {
                console.log(response.data);
                setName(response.data.name);
                setImageURL(response.data.imageUrl);
                setImagesSub(response.data.imagesSub);
                setImagesSubOld(response.data.imagesSub);
                setVideoURL(response.data.videoUrl);
                setPrice(response.data.price);
                setSaleOff(response.data.saleOff);
                setQuantity(response.data.quantity);
                setSoftware(response.data.software);
                setLinkDownload(response.data.linkDownload);
                setDesc(response.data.desc);
                setStatus(response.data.status);
            })
            .catch(error => {
            console.log(error);
            });
    },[]);

    const uploadAvtProduct = async() => {
      const imagRef = ref(storage,`images/products/${selectedImage.name + v4()}`);
          await uploadBytes(imagRef, selectedImage)
        .then(()=>{
            // Lấy URL của ảnh từ StorageRef
            getDownloadURL(imagRef)
            .then((url) => {
                console.log(url); // In URL của ảnh ra console
                setImageURL(url);
                axios.put(api +`/product/update/${id}`, {imageUrl: url}, { headers })
                .then(response => {
                    notifySuccess('Ảnh đã được lưu!');
                })
                .catch(error => {
                console.log(error);
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
    //Upload Image lên Firebase và xóa ảnh cũ
    const handleChangeImage = async(e) => {
        e.preventDefault();
        if(selectedImage == null) {
            notifyError('Bạn chưa chọn ảnh mới!')
        } else {
        if(imageURL){
        const imageOld = ref(storage,imageURL);
        var deleteImageOld; 
        await deleteObject(imageOld)
        .then(()=> deleteImageOld=1)
        .catch((err)=> deleteImageOld=err);
        console.log(deleteImageOld);
        if(deleteImageOld === 1){
          uploadAvtProduct();
        } else console.log(deleteImageOld);
        } else {
          if(!imageURL) uploadAvtProduct();
        }
        }
        
      };
    const product = {
        name:name,
        imageUrl:imageURL,
        imagesSub: imagesSub,
        videoUrl:vieoURL,
        price: price,
        quantity: quantity,
        saleOff: saleOff,
        software: software,
        linkDownload: linkDownload,
        desc: desc,
        status: status,
    }
    const uploadImageSub = async() => {
      let uploadImageNewCheck = false;
      let listImage = [];
      const promises = [];
      for(let i = 0; i <imageSubSelecte.length; i++){
        const imagRef = ref(storage,`images/products-detail/${imageSubSelecte[i].name + v4()}`);
        await uploadBytes(imagRef,imageSubSelecte[i])
        .then((response)=>{
           const promise = getDownloadURL(imagRef)
            .then((url) => {
              uploadImageNewCheck = true;
              listImage.push(url);
              setImagesSub((prevUrls) => [...prevUrls, url]); // Cập nhật danh sách các URL
              return url;
            })
            .catch((err) => {
            console.log(err);
            });
            promises.push(promise);
            })
        .catch((err)=>{
          console.log(err);
        })
    }
    if(uploadImageNewCheck===true){
      const listImage = await Promise.all(promises);
      await axios.put(api +`/product/update/${id}`, {imagesSub: listImage}, { headers })
            .then(response => {
              notifySuccess("Đã lưu ảnh thành công!");
            })
            .catch(error => {
            console.log(error);
     });
    }
    }
    const handleChangeImagesSub = async(e) => {
      e.preventDefault();
      let deleteImageOldCheck = false;
      if(imageSubSelecte == null) {
        notifyError('Bạn chưa chọn ảnh mới!')
      } else
      setImagesSub('');
      if(imagesSubOld.length > 0){
      for (let i = 0; i < imagesSubOld.length; i++) {
        const imageRef = ref(storage,imagesSubOld[i]);
        await deleteObject(imageRef)
          .then(() => {
            deleteImageOldCheck=true;
          })
          .catch((error) => {
            console.log(error);
            notifyError('Đã có lỗi xảy ra. Kiểm tra lại!');
          });
      }
      if(deleteImageOldCheck===true){
        uploadImageSub();
      }
    }else uploadImageSub();
    };
    //Hàm update to api
    const updateToAPI = async() => {
      console.log(product);
            await axios.put(api +`/product/update/${id}`, product, { headers })
            .then(response => {
                notifySuccess('Sửa thông tin thành công!');
                setTimeout(function() {
                    navigate('/admin/product');
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
    }
    //Update thông tin sản phẩm
    const handleUpdateProduct = async(e) => {
        e.preventDefault();
        if( !name ||!imageURL||!vieoURL||!price||!desc ||!imagesSub){
          console.log(product);
            notifyError('Thông tin không được để trống!');
        } 
        else{
          if(software === false){
            if(quantity){
              updateToAPI();
            } else notifyError('Thông tin không được để trống!');
          } else {
            if(!linkDownload){
              notifyError('Thông tin không được để trống!');
            }else updateToAPI();
          }
        } 
    }
    
    return ( 
        <DefaultLayout>
        <div className="container-fluid pt-4 px-4">
        <div className="row">
        <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Sửa Thông Tin Sản Phẩm</h4>
                    <p className="card-description"> Thêm mới sản phẩm </p>
                    <form onSubmit={handleUpdateProduct} className="forms-sample">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                            <label>Image upload</label><br></br>
                                <img src={imageURL || 
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
                          <label htmlFor="inputStatus">Hiển Thị</label>
                            <div className="col-sm-9">
                            <button 
                            id="inputStatus"
                            className={`toggle-btn ${status ? "active" : ""}`} 
                            onClick={(e) => {e.preventDefault(); setStatus(!status);}}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên Sản Phẩm</label>
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
                            <label htmlFor="inputCategory">Loại Sản Phẩm</label>
                            <div className="col-sm-9">
                                <select className="form-control" id="inputCategory" 
                                onChange={(e) =>{
                                e.target.value === "1" ? setSoftware(false) : setSoftware(true)
                                }}
                                value={software ? '2' : '1'}
                                >
                                <option value="1">Product</option>
                                <option value="2">Software</option>
                                </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputVideoUrl">Video URL</label>
                            <div className="col-sm-9">
                              <input type="text" id="inputVideoUrl" 
                              className="form-control"
                              value={vieoURL} 
                              onChange={(e)=>setVideoURL(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputPrice">Giá Sản Phẩm</label>
                            <div className="col-sm-9">
                              <input 
                              type="number" 
                              id="inputPrice" 
                              className="form-control" 
                              value={price}
                              onChange={(e)=>setPrice(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                      {!software &&
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputQuantity">Số Lượng</label>
                            <div className="col-sm-9">
                              <input type="number" id="inputQuantity" 
                              className="form-control" 
                              value={quantity}
                              onChange={(e)=>setQuantity(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      }
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputSaleOff">Giảm Giá (Nếu có)</label>
                            <div className="col-sm-9">
                              <input type="number" id="inputSaleOff" 
                              className="form-control" 
                              value={saleOff}
                              onChange={(e)=>setSaleOff(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {software 
                        &&
                        (
                        <div className="row">
                        <div className="col-md-12">
                            <div className="form-group row">
                            <label htmlFor="inputLinkDownload">Link Download</label>
                            <div className="col-sm-9">
                                <input type="text" 
                                value={linkDownload} id="inputLinkDownload" 
                                className="form-control" onChange={(e)=>setLinkDownload(e.target.value)} />
                            </div>
                        </div>
                        </div>
                      </div>
                        )
                      }
                      <div className="row g-3 mt-4 bg-image-sub">
                      <label>Ảnh Mô Tả Sản Phẩm</label>
                      {imagesSub ? imagesSub.map((image)=> (
                        <div key={image} className="col-md-4">
                          <img src={image}
                          className="img-add-preview" alt="Ảnh mô tả sản phẩm"/>
                        </div>
                      ))
                      : 
                      <div className="col-md-4">
                          <img src="https://firebasestorage.googleapis.com/v0/b/uploadingvnsim.appspot.com/o/images%2FR.jpg?alt=media&token=6ff3f044-a8ea-42f3-a30e-0475583c9477" 
                          className="img-add-preview" alt="Ảnh mô tả sản phẩm"/>
                      </div>
                      }
                          <input type="file" 
                            className="file-upload-default mt-4"
                            accept=".png,.jpg,.jpeg"
                            multiple
                            onChange={(e) => {
                                if (e.target.files.length > 3) {
                                    alert("Vui lòng chọn tối đa 3 tệp");
                                    e.target.value = null; // xóa các tệp đã chọn nếu số lượng vượt quá giới hạn
                                } else {
                                    setImageSubSelecte(e.target.files);
                                }
                            }}
                        />
                        <button onClick={handleChangeImagesSub} className="btn btn-primary btn-add-subimg mt-2">Lưu ảnh lên cloud</button>
                      </div>
                      <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                        <label htmlFor="inputDesc">Mô Tả Sản Phẩm</label>
                        <ReactQuill 
                        id="inputDesc"
                        theme="snow" 
                        className="editor-text"
                        value={desc} 
                        onChange={setDesc} 
                        modules={modules}
                        />
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

export default UpdateProduct;