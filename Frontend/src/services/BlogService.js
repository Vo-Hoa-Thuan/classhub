import axios from 'axios';
import { api } from '../api';

class BlogService {
  // Lấy danh sách bài viết đã duyệt (public)
  async getApprovedBlogs() {
    try {
      const response = await axios.get(`${api}/blog/public/approved`);
      return response.data;
    } catch (error) {
      console.error('Error fetching approved blogs:', error);
      throw error;
    }
  }

  // User tạo bài viết mới
  async createBlogPost(blogData) {
    try {
      const response = await axios.post(`${api}/blog/create`, blogData);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  // User lấy bài viết của mình
  async getUserBlogs() {
    try {
      const response = await axios.get(`${api}/blog/user/my-blogs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw error;
    }
  }

  // Blogger lấy bài viết chờ duyệt
  async getPendingBlogs() {
    try {
      const response = await axios.get(`${api}/blog/admin/pending`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending blogs:', error);
      throw error;
    }
  }

  // Blogger duyệt/từ chối bài viết
  async approveBlog(blogId, action, rejectionReason = null) {
    try {
      const response = await axios.put(`${api}/blog/admin/approve/${blogId}`, {
        action,
        rejectionReason
      });
      return response.data;
    } catch (error) {
      console.error('Error approving blog:', error);
      throw error;
    }
  }

  // Lấy danh sách topics
  async getTopics() {
    try {
      const response = await axios.get(`${api}/topic`);
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  // Lấy chi tiết bài viết
  async getBlogById(blogId) {
    try {
      const response = await axios.get(`${api}/blog/${blogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }
}

export default new BlogService();
