import { useState } from "react";
import ReactQuill from 'react-quill';
import { getDownloadURL, ref,uploadBytes } from 'firebase/storage';
import {v4} from 'uuid';
import 'react-quill/dist/quill.snow.css';
import { Link } from "react-router-dom";
import { storage } from '../../../../firebase';

import DefaultLayout from "../../layout/default/DefaultLayout";
import './CrudProduct.scss';
import { modules } from "../../childrencomponents/texteditor/TextEditorCustom";
import axios from "axios";
import { api} from "../../../../api";
import Toast,{notifySuccess, notifyError} from "../../../../components/toast/Toast";

function AddProduct() {
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [imagesSub, setImagesSub] = useState('');
    const [imageSubSelecte,setImageSubSelecte] = useState(null);
    const [vieoURL, setVideoURL] = useState('');
    const [price, setPrice] = useState(0);
    const [saleOff, setSaleOff] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [software, setSoftware] = useState(false);
    const [linkDownload, setLinkDownload] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState(true);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };
    const product = {
        name:name,
        imageUrl:imageURL,
        imagesSub: imagesSub,
        videoUrl:vieoURL,
        price: price,
        quantity: quantity,
        purchased: 0,
        saleOff: saleOff,
        software: software,
        linkDownload: linkDownload,
        desc: desc,
        status: status,
    }

    const clearInput = () => {
      setName("");
      setImageURL('');
      setSelectedImage(null);
      imagesSub([]);
      setImageSubSelecte(null);
      setVideoURL("");
      setQuantity(0);
      setLinkDownload('');
      setPrice(0);
      setSaleOff(0);
      setDesc("");
    }
    //Upload Image lên Firebase
    const handleUploadImage = async(e) => {
        e.preventDefault();
        if(selectedImage === null) notifyError("Bạn chưa chọn ảnh!") 
        else {
        const imagRef = ref(storage,`images/products/${selectedImage.name + v4()}`);
        await uploadBytes(imagRef, selectedImage)
        .then(()=>{
            // Lấy URL của ảnh từ StorageRef
            getDownloadURL(imagRef)
            .then((url) => {
                console.log(url); // In URL của ảnh ra console
                setImageURL(url);
                notifySuccess("Tải ảnh thành công!")
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err)=>{
          console.log(err);
        })
        }
      };
      
      const handleUploadImagesSub = async(e) => {
        e.preventDefault()
        if(imageSubSelecte === null){
          notifyError("Bạn chưa chọn ảnh mô tả!")
        }else {
          if(imageSubSelecte){
            for(let i = 0; i <imageSubSelecte.length; i++){
              const imagRef = ref(storage,`images/products-detail/${imageSubSelecte[i].name + v4()}`);
              const result = await uploadBytes(imagRef,imageSubSelecte[i])
              .then((response)=>{
                notifySuccess("Upload ảnh thành công!")
                  getDownloadURL(imagRef)
                      .then((url) => {
                      setImagesSub((prevUrls) => [...prevUrls, url]); // Cập nhật danh sách các URL
                      })
                      .catch((err) => {
                      console.log(err);
                      });
                      })
              .catch((err)=>{
                  console.log(err);
              })
              console.log(result);
          }
          }
        }
      };
      //Hàm add to api
      const addToAPI = async() => {
        console.log(product);
            await axios.post(api +'/product', product, { headers })
            .then(response => {
                notifySuccess("Thêm sản phẩm thành công!")
                setTimeout(function() {
                    clearInput();
                  }, 2000);
            })
            .catch(error => {
            console.log(error);
            });
        }
      //Add product vào api
    const handleAddProduct = async(e) =>{
        e.preventDefault();
        if( !name ||!imageURL ||!vieoURL||!price||!desc ||!imagesSub){
          console.log(product);
            notifyError("Thông tin không được để trống!")
        } 
        else{
          if(software === false){
            if(quantity){
              addToAPI();
            } else notifyError("Thông tin không được để trống!");
          } else {
            if(!linkDownload){
              notifyError("Thông tin không được để trống!");
            }else addToAPI();
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
                    <h4 id="titleTable" className="card-title text-dark upcase">Thêm Mới Sản Phẩm</h4>
                    <p className="card-description"> Thêm mới sản phẩm </p>
                    <form onSubmit={handleAddProduct} className="forms-sample">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                            <label>Tải Ảnh Sản Phẩm</label><br></br>
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
                            <button onClick={handleUploadImage} className="btn btn-primary" type="button">Upload</button>
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
                                }}>
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
                              <input 
                              type="number" 
                              id="inputQuantity" 
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
                              <input 
                              type="number" 
                              id="inputSaleOff" 
                              className="form-control" 
                              value={saleOff}
                              onChange={(e)=>setSaleOff(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {software &&
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
                        <button onClick={handleUploadImagesSub} className="btn btn-primary btn-add-subimg mt-2">Lưu ảnh lên cloud</button>
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
                          <button type="submit" className="btn btn-success">Thêm</button>
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

export default AddProduct;