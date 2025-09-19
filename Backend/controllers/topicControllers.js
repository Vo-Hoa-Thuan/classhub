const Topic = require('../models/Topic')
const Blog = require('../models/Blog')

const topicControllers = {
    addTopic: async (req,res) => {
       try {
        const newTopic = new Topic(req.body);
        const save= await newTopic.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllTopic: async (req,res)=>{
        try {
            const topics = await Topic.find();
            res.status(200).json(topics);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getTopic: async (req,res)=>{
        try {
            const topic = await Topic.findById(req.params.id);
            res.status(200).json(topic);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateTopic: async (req,res)=>{
        try {
            const topic = await Topic.findById(req.params.id);
            await topic.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteTopic: async (req,res)=>{
        try {
            await Blog.updateMany(
                {topic: req.params.id},
                {$pull: {topic: req.params.id}}
                )
            const topic = await Topic.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = topicControllers;