const Blog = require('../models/Blog')

const blogControllers = {
    searchBlog: async (req,res)=>{
        try {
            var search = req.body.search;
            const resultSearch = await Blog.find({
                $and: [
                    {
                        $or: [
                            { topic: { $regex: new RegExp(search, "i") } },
                            { title: { $regex: new RegExp(search, "i") } }
                        ]
                    },
                    { approvalStatus: 'approved' },
                    { status: true }
                ]
            })
            .populate('authorId', 'fullname email image')
            .populate('topic')
            .sort({ createdAt: -1 });
            
            if(resultSearch.length > 0) {
                res.status(200).json(resultSearch);
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy bài viết nào!'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tìm kiếm bài viết',
                error: error.message
            });
        }
    },
    addBlog: async (req,res) => {
       try {
        const newBlog = new Blog(req.body);
        const saveBlog = await newBlog.save();
        res.status(200).json({
            success: true,
            data: saveBlog,
            message: "Tạo bài viết thành công"
        });
       } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi tạo bài viết",
            error: error.message
        });
       }
    },
    getAllBlog: async (req,res)=>{
        try {
            const blogs = await Blog.find({
                approvalStatus: 'approved',
                status: true
            })
            .populate('authorId',"fullname email image")
            .populate('topic')
            .sort({ createdAt: -1 });
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bài viết",
                error: error.message
            });
        }
    },
    getAllBlogByBlogger: async (req,res)=>{
        try {
            const blogs = await Blog.find({
                authorId: req.params.id,
                approvalStatus: 'approved',
                status: true
            })
            .populate('authorId',"fullname email image")
            .populate('topic')
            .sort({ createdAt: -1 });
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bài viết của blogger",
                error: error.message
            });
        }
    },
    getBlog: async (req,res)=>{
        try {
            const blog = await Blog.findOne({
                _id: req.params.id,
                approvalStatus: 'approved',
                status: true
            })
            .populate('authorId',"fullname email image")
            .populate('topic');
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Bài viết không tồn tại hoặc chưa được duyệt"
                });
            }
            
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy bài viết",
                error: error.message
            });
        }
    },
    getPersonalBlog: async (req,res)=>{
        try {
            const blog = await Blog.findOne({
                _id: req.params.id,
                authorId: req.user.id // Chỉ lấy bài viết của user hiện tại
            })
            .populate('authorId',"fullname email image")
            .populate('topic');
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Bài viết không tồn tại hoặc không thuộc về bạn"
                });
            }
            
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy bài viết",
                error: error.message
            });
        }
    },
    updateBlog: async (req,res)=>{
        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Bài viết không tồn tại"
                });
            }
            await blog.updateOne({$set: req.body});
            res.status(200).json({
                success: true,
                message: "Cập nhật bài viết thành công"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi cập nhật bài viết",
                error: error.message
            });
        }
    },
    deleteBlog: async (req,res)=>{
        try {
            const blog = await Blog.findByIdAndDelete(req.params.id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Bài viết không tồn tại"
                });
            }
            res.status(200).json({
                success: true,
                message: "Xóa bài viết thành công"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi xóa bài viết",
                error: error.message
            });
        }
    },
    
    // API cho user đăng blog (chờ duyệt)
    createBlogPost: async (req, res) => {
        try {
            const blogData = {
                ...req.body,
                authorId: req.user.id,
                approvalStatus: 'pending',
                status: false // Tắt hiển thị cho đến khi được duyệt
            };
            const newBlog = new Blog(blogData);
            const savedBlog = await newBlog.save();
            res.status(200).json({
                success: true,
                message: "Bài viết đã được gửi chờ duyệt",
                data: savedBlog
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi tạo bài viết",
                error: error.message
            });
        }
    },
    
    // API lấy bài viết chờ duyệt (cho blogger)
    getPendingBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find({ approvalStatus: 'pending' })
                .populate('authorId', 'fullname email image')
                .populate('topic')
                .sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                data: blogs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bài viết chờ duyệt",
                error: error.message
            });
        }
    },
    
    // API duyệt bài viết (cho blogger)
    approveBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const { action, rejectionReason } = req.body; // action: 'approve' hoặc 'reject'
            
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy bài viết"
                });
            }
            
            if (action === 'approve') {
                blog.approvalStatus = 'approved';
                blog.approvedBy = req.user.id;
                blog.approvedAt = new Date();
                blog.rejectionReason = null;
            } else if (action === 'reject') {
                blog.approvalStatus = 'rejected';
                blog.approvedBy = req.user.id;
                blog.approvedAt = new Date();
                blog.rejectionReason = rejectionReason || 'Không đạt yêu cầu';
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Action không hợp lệ"
                });
            }
            
            await blog.save();
            
            res.status(200).json({
                success: true,
                message: action === 'approve' ? "Bài viết đã được duyệt" : "Bài viết đã bị từ chối",
                data: blog
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi duyệt bài viết",
                error: error.message
            });
        }
    },
    
    // API lấy bài viết đã duyệt (public)
    getApprovedBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find({ 
                approvalStatus: 'approved',
                status: true 
            })
                .populate('authorId', 'fullname email image')
                .populate('topic')
                .populate('approvedBy', 'fullname')
                .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)
            res.status(200).json({
                success: true,
                data: blogs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bài viết",
                error: error.message
            });
        }
    },
    
    // API lấy bài viết của user (bao gồm trạng thái duyệt)
    getUserBlogs: async (req, res) => {
        try {
            const blogs = await Blog.find({ authorId: req.user.id })
                .populate('topic')
                .populate('approvedBy', 'fullname')
                .sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                data: blogs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy bài viết của user",
                error: error.message
            });
        }
    },

    // API lấy chi tiết bài viết cá nhân (tất cả trạng thái)
    getPersonalBlog: async (req, res) => {
        try {
            const blog = await Blog.findOne({ 
                _id: req.params.id, 
                authorId: req.user.id 
            })
            .populate('topic')
            .populate('authorId', 'fullname email')
            .populate('approvedBy', 'fullname');

            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Bài viết không tồn tại hoặc không thuộc về bạn"
                });
            }

            res.status(200).json({
                success: true,
                data: blog
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy chi tiết bài viết",
                error: error.message
            });
        }
    },

    // API lấy TẤT CẢ bài viết cho admin (bao gồm đã duyệt, chờ duyệt, bị từ chối)
    getAllBlogsForAdmin: async (req, res) => {
        try {
            const blogs = await Blog.find({})
                .populate('authorId', 'fullname email image')
                .populate('topic')
                .populate('approvedBy', 'fullname')
                .sort({ createdAt: -1 });
            
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lỗi khi lấy danh sách bài viết cho admin",
                error: error.message
            });
        }
    },
};

module.exports = blogControllers;