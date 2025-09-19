const Product = require("../models/Product");
const OrderApp = require("../models/OrderApp");

const productControllers = {
    searchProduct: async (req,res)=>{
        try {
            var search = req.body.search;
            const resultSearch = await Product.find({
                name: { $regex: new RegExp(search, "i") },
              }).select("-linkDownload");
            if(resultSearch.length > 0) {
                res.status(200).json(resultSearch);
            } else {
                res.status(500).json('Products no found!');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addProduct: async (req,res) => {
       try {
        const newProduct = new Product(req.body);
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllProduct: async (req,res)=>{
        try {
            const products = await Product.find().select("-linkDownload");
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getProduct: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id).select("-linkDownload");
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getProductByAdmin: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateProduct: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id);
            await product.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updatePurchasedProduct: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id);
            product.purchased +=1;
            await product.updateOne({purchased: product.purchased});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateQtyPurchased: async (req,res)=>{
        try {
            const product = await Product.findById(req.params.id);
            product.quantity = parseInt(product.quantity) - parseInt(req.body.quantity);
            product.purchased = parseInt(product.purchased) + parseInt(req.body.quantity);
            await product.updateOne({purchased: product.purchased,
                                    quantity: product.quantity});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteProduct: async (req,res)=>{
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getLinkDownload: async (req,res)=>{
        try {
            const orderApp = await OrderApp.findById(req.body.orderAppId);
            if(orderApp){
                if(orderApp.paymentStatus===true){
                    const product = await Product.findById(req.body.productId);
                    if(product){
                        res.status(200).json(product.linkDownload);
                    }else res.status(500).json("The product does not exist"); 
                } else res.status(500).json("You haven't paid");
            } else res.status(500).json("The order does not exist");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    checkDownloaded: async (req, res) => {
        try {
            const product = await Product.findById(req.body.productId).select("linkDownload");
            const orderApp = await OrderApp.find({
                $and: [
                    {product: req.body.productId},
                    {user: req.body.userId}
                ]
            });
            if (orderApp.length > 0) {
                let unpaidFound = false;
                for (let i = 0; i < orderApp.length; i++) {
                    if (orderApp[i].paymentStatus) {
                        unpaidFound = true;
                    }
                }
                if (unpaidFound) {
                    res.status(200).json(product);
                } else {
                    res.status(201).json('Unpaid');
                }
            } else {
                res.status(202).json('Not found');
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = productControllers;