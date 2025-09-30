const blogControllers = require("../controllers/blogControllers");
const middlewareControllers = require("../controllers/middlewareControllers");
const permissionMiddleware = require("../controllers/permissionMiddleware");

const router = require("express").Router();

//ADD BLOG (legacy - cho blogger)
router.post("/",middlewareControllers.vertifyToken, blogControllers.addBlog);

//GET ALL BLOG (legacy)
router.get("/", blogControllers.getAllBlog);

//GET ALL BLOG BY BLOGGER
router.get("/get_by_blogger/:id", middlewareControllers.vertifyToken, blogControllers.getAllBlogByBlogger);

//GET BLOG
router.get("/:id", blogControllers.getBlog);

//SEARCH BLOG
router.post("/search", blogControllers.searchBlog);

//UPDATE BLOG
router.put("/update/:id",middlewareControllers.vertifyToken, blogControllers.updateBlog);

//DELETE BLOG
router.delete("/delete/:id",middlewareControllers.vertifyToken, blogControllers.deleteBlog);

// ====== NEW BLOG APPROVAL SYSTEM ======

// User tạo bài viết (chờ duyệt)
router.post("/create", middlewareControllers.vertifyToken, blogControllers.createBlogPost);

// Lấy bài viết đã duyệt (public)
router.get("/public/approved", blogControllers.getApprovedBlogs);

// User xem bài viết của mình
router.get("/user/my-blogs", middlewareControllers.vertifyToken, blogControllers.getUserBlogs);

// User xem chi tiết bài viết cá nhân (tất cả trạng thái)
router.get("/personal/:id", middlewareControllers.vertifyToken, blogControllers.getPersonalBlog);

// Blogger xem bài viết chờ duyệt
router.get("/admin/pending", 
    middlewareControllers.vertifyToken, 
    permissionMiddleware.requirePermission('canApprovePosts'), 
    blogControllers.getPendingBlogs
);

// Blogger duyệt/từ chối bài viết
router.put("/admin/approve/:id", 
    middlewareControllers.vertifyToken, 
    permissionMiddleware.requirePermission('canApprovePosts'), 
    blogControllers.approveBlog
);

// Admin lấy TẤT CẢ bài viết (đã duyệt, chờ duyệt, bị từ chối)
router.get("/admin/all", 
    middlewareControllers.vertifyToken, 
    permissionMiddleware.requirePermission('canApprovePosts'), 
    blogControllers.getAllBlogsForAdmin
);

module.exports = router;