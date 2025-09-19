const Blog = require('../models/Blog')

const blogControllers = {
    searchBlog: async (req,res)=>{
        try {
            var search = req.body.search;
            const resultSearch = await Blog.find({
                $or: [
                    { topic: { $regex: new RegExp(search, "i") } },
                    { title: { $regex: new RegExp(search, "i") } }
                  ]
              });
            if(resultSearch.length > 0) {
                res.status(200).json(resultSearch);
            } else {
                res.status(500).json('Blogs no found!');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addBlog: async (req,res) => {
       try {
        const newBlog = new Blog(req.body);
        const saveBlog = await newBlog.save();
        res.status(200).json(saveBlog);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllBlog: async (req,res)=>{
        try {
            const blogs = await Blog.find()
            .populate('authorId',"fullname email image")
            .populate('topic');
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAllBlogByBlogger: async (req,res)=>{
        try {
            const blogs = await Blog.find({authorId: req.params.id})
            .populate('authorId',"fullname email image")
            .populate('topic');
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getBlog: async (req,res)=>{
        try {
            const blog = await Blog.findById(req.params.id)
            .populate('authorId',"fullname email image")
            .populate('topic');
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateBlog: async (req,res)=>{
        try {
            const blog = await Blog.findById(req.params.id);
            await blog.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteBlog: async (req,res)=>{
        try {
            const blog = await Blog.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = blogControllers;