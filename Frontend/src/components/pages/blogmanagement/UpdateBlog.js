import { Link, useNavigate, useParams } from "react-router-dom";
import Default from "../../layout/default/Default";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../api";
import Toast, { notifyError, notifySuccess } from "../../toast/Toast";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase";
import { v4 } from "uuid";
import ReactQuill from "react-quill";
import { modules } from "../../../admin/components/childrencomponents/texteditor/TextEditorCustom";

function UpdateBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topicTitle, setTopicTitle] = useState('');
    const [topicId, setTopicId] = useState('');
    const [topics, setTopics] = useState([]);
    const [title, setTitle] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [status, setStatus] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : [];
    });
    const headers = {
      token: `Bearer ${token}`,
      };
      useEffect(()=>{
        axios.get(api +`/blog/${id}`)
            .then(response => {
                console.log(response.data);
                setTopicTitle(response.data.topic.title);
                setTopicId(response.data.topic._id);
                setTitle(response.data.title);
                setImageUrl(response.data.imageUrl);
                setShortDesc(response.data.shortDesc);
                setDesc(response.data.desc);
                setStatus(response.data.status);
            })
            .catch(error => {
            console.log(error);
            });
    },[]);
    useEffect(()=>{
      axios.get(api +'/topic')
      .then(response => {
        console.log(response.data);
        setTopics(response.data);
      })
      .catch(error => {
      console.log(error);
      });
    },[]);
    const blog = {
        topic: topicId,
        title: title,
        shortDesc: shortDesc,
        desc: desc,
        imageUrl: imageUrl,
        authorId: user._id,
        status: status,
    }
    const uploadImage = async() => {
        const imagRef = ref(storage,`images/blogs/${selectedImage.name + v4()}`);
          await uploadBytes(imagRef, selectedImage)
          .then(()=>{
              // Lấy URL của ảnh từ StorageRef
              getDownloadURL(imagRef)
              .then((url) => {
                  console.log(url); // In URL của ảnh ra console
                  setImageUrl(url);
                  axios.put(api +`/blog/update/${id}`, {imageUrl: url}, { headers })
                  .then(response => {
                    notifySuccess('Đã lưu ảnh lên cloud');
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
      //Upload Image lên Firebase
      const handleUploadImage = async(e) => {
          e.preventDefault();
          if(selectedImage == null) {
              notifyError('Bạn chưa chọn ảnh mới!')
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
          } else uploadImage();
        };
        //Update blog vào api
      const handleUpdateBlog = async(e) =>{
          e.preventDefault();
          if( !topicId ||!imageUrl ||!title||!shortDesc||!desc){
            notifyError("Thông tin không được để trống!");
          } else {
              console.log(blog);
              await axios.put(api +`/blog/update/${id}`, blog, { headers })
              .then(response => {
                notifySuccess("Sửa bài viết thành công!");
                  setTimeout(function() {
                      navigate('/blog-management')
                    }, 2000);
              })
              .catch(error => {
              console.log(error);
              });
          }
      };
    return ( 
        <Default>
        <div className="container-fluid pt-4 px-4">
        <div className="row">
        <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 id="titleTable" className="card-title text-dark upcase">Sửa bài viết</h4>
                    <p className="card-description"> Sửa bài viết</p>
                    <form onSubmit={handleUpdateBlog} className="forms-sample">
                    <div className="row">
                    <div className="col-md-6">
                          <div className="form-group row">
                            <label htmlFor="inputTopic">Topic Bài Viết</label>
                            <div className="col-sm-9">
                                <select className="form-control input-topic" id="inputTopic" 
                                onChange={(e) =>setTopicId(e.target.value)}
                                value={topicId}
                                >
                                 {topics.map((topic)=>(
                                  <option key={topic._id} value={topic._id}>{topic.title}</option>
                                ))}
                                {!topics.some((t) => t._id === topicTitle) && (
                                  <option value={topicId}>{topicTitle}</option>
                                )}
                                </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row">
                          <label htmlFor="inputName">Tên Bài Viết</label>
                            <div className="col-sm-9">
                              <input 
                              type="text" 
                              id="inputName" 
                              value={title}
                              className="form-control" 
                              onChange={(e)=>setTitle(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                        <label htmlFor="inputDesc">Mô Tả Ngắn</label>
                        <textarea value={shortDesc} 
                        onChange={(e)=>setShortDesc(e.target.value)}
                        className="form-control"
                        ></textarea>
                      </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                        <label htmlFor="inputDesc">Mô Tả Dài</label>
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
                      <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                            <label>Tải Ảnh Sản Phẩm</label><br></br>
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
                            <button className={`toggle-btn ${status ? "active" : ""}`} onClick={(e) => {e.preventDefault(); setStatus(!status);}}>
                                <div className="slider"></div>
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="action-form">
                          <button type="submit" className="btn btn-success">Sửa</button>
                          <Link to='/blog-management' className="btn btn-light">Cancel</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <Toast/>
        </Default>
     );
}

export default UpdateBlog;