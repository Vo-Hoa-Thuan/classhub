const blogControllers = require("../controllers/blogControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//ADD BLOG
router.post("/",middlewareControllers.vertifyToken, blogControllers.addBlog);

//GET ALL BLOG
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

module.exports = router;