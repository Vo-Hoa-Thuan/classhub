const OrderTracking = require('../models/OrderTracking');

const orderTrackingControllers = {
    addOrderTracking: async (req,res) => {
       try {
        const newOrderTracking = new OrderTracking(req.body);
        const save = await newOrderTracking.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllOrderTracking: async (req,res)=>{
        try {
            const orderTrackings = await OrderTracking.find();
            res.status(200).json(orderTrackings);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getOrderTracking: async (req,res)=>{
        try {
            const orderTracking = await OrderTracking.findById(req.params.id);
            res.status(200).json(orderTracking);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateOrderTracking: async (req,res)=>{
        try {
            const orderTracking = await OrderTracking.findById(req.params.id);
            await orderTracking.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteOrderTracking: async (req,res)=>{
        try {
            const orderTracking = await OrderTracking.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = orderTrackingControllers;