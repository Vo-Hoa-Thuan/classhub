const OrderApp = require('../models/OrderApp');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const orderAppControllers = {
    addOrderApp: async (req,res) => {
       try {
        const newOrderApp = new OrderApp(req.body);
        const save= await newOrderApp.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllOrderApp: async (req,res)=>{
        try {
            const orderApps = await OrderApp.find()
            .populate("user","fullname email")
            .populate("product","name imageUrl")
            .populate("payment","name imageUrl");
            res.status(200).json(orderApps);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getOrderAppByUser: async (req,res)=>{
        try {
            const orders = await OrderApp.find({ user: req.params.id })
            .populate("user","fullname email")
            .populate("product","name imageUrl")
            .populate("payment","name imageUrl");
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getOrderApp: async (req,res)=>{
        try {
            const orderApp = await OrderApp.findById(req.params.id)
            .populate("user","fullname email")
            .populate("product","-linkDownload")
            .populate("payment","name imageUrl");
            res.status(200).json(orderApp);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateOrderApp: async (req,res)=>{
        try {
            const orderApp = await OrderApp.findById(req.params.id);
            await orderApp.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteOrderApp: async (req,res)=>{
        try {
            const orderApp = await OrderApp.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //Thanh toán với VNPay
    paymentVNPay: async (req, res, next) => {
        // process.env.TZ = 'Asia/Ho_Chi_Minh';
    let userId = req.body.userId;
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');
    
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnAppUrl');
    let orderId = moment(date).format('HHmmss');
    let amount = req.body.total;
    let bankCode = '';

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    urlCreate =vnpUrl+'?' + querystring.stringify(vnp_Params, { encode: false });
    return res.status(200).json(urlCreate);
}
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = orderAppControllers;