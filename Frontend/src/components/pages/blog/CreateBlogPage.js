import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Default from '../../layout/default/Default';
import BlogService from '../../../services/BlogService';
import { useAuth } from '../../../hooks/useAuth';
import ReactQuill from 'react-quill';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { storage } from '../../../firebase';
import Toast, { notifyError, notifySuccess } from '../../toast/Toast';
import { modules } from '../../../admin/components/childrencomponents/texteditor/TextEditorCustom';
import 'react-quill/dist/quill.snow.css';
import './CreateBlogPage.scss';

function CreateBlogPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    desc: '',
    imageUrl: '',
    topic: ''
  });

  useEffect(() => {
    // Kiểm tra user đã đăng nhập chưa
    if (!user) {
      navigate('/login');
      return;
    }

    // Lấy danh sách topics
    loadTopics();
  }, [user, navigate]);

  const loadTopics = async () => {
    try {
      const response = await BlogService.getTopics();
      setTopics(response);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Upload Image lên Firebase
  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (selectedImage == null) return notifyError('Bạn chưa chọn ảnh!');
    
    try {
      // Tạo tên file an toàn, loại bỏ ký tự đặc biệt
      const fileName = selectedImage.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileExtension = fileName.split('.').pop();
      const safeFileName = `${fileName.split('.')[0]}_${v4()}.${fileExtension}`;
      
      const imagRef = ref(storage, `images/blogs/${safeFileName}`);
      
      console.log('Uploading file:', safeFileName);
      
      await uploadBytes(imagRef, selectedImage);
      
      // Lấy URL của ảnh từ StorageRef
      const url = await getDownloadURL(imagRef);
      console.log('Upload successful, URL:', url);
      setFormData(prev => ({
        ...prev,
        imageUrl: url
      }));
      notifySuccess('Đã lưu ảnh lên cloud');
      
    } catch (error) {
      console.error('Upload error:', error);
      if (error.code === 'storage/unauthorized') {
        notifyError('Không có quyền upload ảnh. Vui lòng kiểm tra cấu hình Firebase!');
      } else if (error.code === 'storage/canceled') {
        notifyError('Upload bị hủy!');
      } else if (error.code === 'storage/unknown') {
        notifyError('Lỗi không xác định. Có thể do CORS hoặc cấu hình Firebase!');
      } else {
        notifyError(`Lỗi upload: ${error.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.shortDesc || !formData.desc || !formData.topic) {
      notifyError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      // Thêm approvalStatus = 'pending' để bài viết cần duyệt
      const blogData = {
        ...formData,
        status: false, // Bật hiển thị
        approvalStatus: 'pending' // User tạo bài viết cần duyệt
      };
      
      const response = await BlogService.createBlogPost(blogData);
      if (response.success) {
        notifySuccess('Bài viết đã được gửi chờ duyệt!');
        setTimeout(() => {
          navigate('/blog');
        }, 2000);
      } else {
        notifyError('Có lỗi xảy ra: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      notifyError('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Default>
      <div className="create-blog-page">
        <div className="container-fluid pt-4 px-4">
          <div className="row">
            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-dark upcase">Đăng Bài Viết Mới</h4>
                  <p className="card-description">Viết và chia sẻ bài viết của bạn với cộng đồng</p>
                  
                  <form onSubmit={handleSubmit} className="forms-sample">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label htmlFor="topic">Chủ đề bài viết *</label>
                          <div className="col-sm-9">
                            <select 
                              className="form-control input-topic" 
                              id="topic" 
                              name="topic"
                              value={formData.topic}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Chọn chủ đề</option>
                              {topics.map((topic) => (
                                <option key={topic._id} value={topic._id}>
                                  {topic.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label htmlFor="title">Tiêu đề bài viết *</label>
                          <div className="col-sm-9">
                            <input 
                              type="text" 
                              id="title" 
                              name="title"
                              value={formData.title}
                              className="form-control" 
                              onChange={handleInputChange}
                              placeholder="Nhập tiêu đề bài viết"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                          <label htmlFor="shortDesc">Mô tả ngắn *</label>
                          <textarea 
                            id="shortDesc"
                            name="shortDesc"
                            value={formData.shortDesc} 
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Mô tả ngắn gọn về bài viết"
                            rows="3"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="form-group row">
                          <label htmlFor="desc">Nội dung bài viết *</label>
                          <ReactQuill 
                            id="desc"
                            theme="snow" 
                            className="editor-text"
                            value={formData.desc} 
                            onChange={(value) => setFormData(prev => ({ ...prev, desc: value }))} 
                            modules={modules}
                            placeholder="Viết nội dung bài viết của bạn..."
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label>Tải ảnh bài viết</label><br></br>
                          <img 
                            src={formData.imageUrl || 
                              'https://firebasestorage.googleapis.com/v0/b/classhub.appspot.com/o/images%2FR.jpg?alt=media&token=6ff3f044-a8ea-42f3-a30e-0475583c9477'} 
                            alt="Selected" 
                            className="img-add-preview" 
                          />
                          <input 
                            type="file" 
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => setSelectedImage(e.target.files[0])} 
                            className="file-upload-default"
                          />
                          <div className="input-group col-xs-12 mt-2">
                            <span className="input-group-append">
                              <button onClick={handleUploadImage} className="btn btn-primary" type="button">
                                Upload
                              </button>
                              <p className="text-small">
                                *Vui lòng click Upload để lưu ảnh. <br></br>
                                Chọn ảnh với kích thước là 2x3 để có kết quả tốt nhất!
                              </p>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label htmlFor="imageUrl">Hoặc nhập URL ảnh</label>
                          <div className="col-sm-9">
                            <input
                              type="url"
                              id="imageUrl"
                              name="imageUrl"
                              value={formData.imageUrl}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="action-form">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-success"
                      >
                        {loading ? 'Đang gửi...' : 'Gửi bài viết chờ duyệt'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => navigate('/blogs')} 
                        className="btn btn-light"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                  
                  <div className="blog-info mt-4">
                    <h4>Lưu ý:</h4>
                    <ul>
                      <li>Bài viết của bạn sẽ được gửi chờ duyệt trước khi hiển thị công khai</li>
                      <li>Vui lòng viết nội dung có chất lượng và phù hợp với quy định</li>
                      <li>Bạn có thể xem trạng thái duyệt bài viết trong phần "Bài viết của tôi"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toast />
      </div>
    </Default>
  );
}

export default CreateBlogPage;
