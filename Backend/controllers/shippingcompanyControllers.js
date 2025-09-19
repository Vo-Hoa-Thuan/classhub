const ShippingCompany = require('../models/ShippingCompany')

const shippingCompanyControllers = {
    addShippingCompany: async (req,res) => {
       try {
        const newCompany = new ShippingCompany(req.body);
        const save= await newCompany.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllShippingCompany: async (req,res)=>{
        try {
            const companys = await ShippingCompany.find();
            res.status(200).json(companys);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getShippingCompany: async (req,res)=>{
        try {
            const company = await ShippingCompany.findById(req.params.id);
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateShippingCompany: async (req,res)=>{
        try {
            const company = await ShippingCompany.findById(req.params.id);
            await company.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteShippingCompany: async (req,res)=>{
        try {
            await ShippingCompany.updateMany(
                {shippingCompany: req.params.id},
                {$pull: {shippingCompany: req.params.id}}
                )
            const company = await ShippingCompany.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = shippingCompanyControllers;