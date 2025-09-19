const Banner = require("../models/Banner");

const bannerControllers = {
    addBanner: async (req,res) => {
       try {
        const newBanner = new Banner(req.body);
        const saveBanner = await newBanner.save();
        res.status(200).json(saveBanner);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllBanner: async (req,res)=>{
        try {
            const banners = await Banner.find();
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getBanner: async (req,res)=>{
        try {
            const banner = await Banner.findById(req.params.id);
            res.status(200).json(banner);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateBanner: async (req,res)=>{
        try {
            const banner = await Banner.findById(req.params.id);
            await banner.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteBanner: async (req,res)=>{
        try {
            const banner = await Banner.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = bannerControllers;