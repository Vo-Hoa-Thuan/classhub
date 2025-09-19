const Payment = require('../models/Payment')

const paymentControllers = {
    addPayment: async (req,res) => {
       try {
        const newPayment = new Payment(req.body);
        const save = await newPayment.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllPayment: async (req,res)=>{
        try {
            const payments = await Payment.find();
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAllPaymentClient: async (req,res)=>{
        try {
            const payments = await Payment.find().select('name imageUrl desc isbank status');
            const simplifiedPayments = payments.map(payment => ({
              _id: payment._id,
              name: payment.name,
              imageUrl: payment.imageUrl,
              desc: payment.desc,
              isbank: payment.isbank,
              status: payment.status
            }));
            res.status(200).json(simplifiedPayments);
          } catch (error) {
            res.status(500).json(error);
          }
    },
    getPayment: async (req,res)=>{
        try {
            const payment = await Payment.findById(req.params.id);
            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updatePayment: async (req,res)=>{
        try {
            const payment = await Payment.findById(req.params.id);
            await payment.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deletePayment: async (req,res)=>{
        try {
            const payment = await Payment.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = paymentControllers;