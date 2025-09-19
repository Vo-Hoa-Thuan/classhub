const Order = require('../models/Order')
// const User = require('../models/User')
// const config = require('config');
// const request = require('request');
const moment = require('moment');
const jwt = require('jsonwebtoken');
// const querystring = require('qs');
// const crypto = require('crypto');

const orderControllers = {
    addOrder: async (req,res) => {
       try {
        const newOreder = new Order(req.body);
        const save = await newOreder.save();
        res.status(200).json(save);
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllOrder: async (req,res)=>{
        try {
            const orders = await Order.find()
            .populate("orderTracking")
            .populate("products.product", "name imageUrl")
            .populate("paymentId", "name imageUrl")
            .populate("shippingCompany","name price imagUrl");
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getOrderByUser: async (req,res)=>{
        try {
            const orders = await Order.find({ userId: req.params.id })
            .populate("orderTracking")
            .populate("products.product")
            .populate("shippingCompany","name price imagUrl");
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getOrder: async (req,res)=>{
        try {
            const order = await Order.findById(req.params.id)
            .populate("orderTracking")
            .populate("products.product","-linkDownload")
            .populate("shippingCompany","name price imagUrl")
            .populate("paymentId", "name imageUrl");
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateOrder: async (req,res)=>{
        try {
            const order = await Order.findById(req.params.id);
            await order.updateOne({$set: req.body});
            res.status(200).json("Update successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteOrder: async (req,res)=>{
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //Thanh toán với VNPay
    paymentVNPay: async (req, res, next) => {
    //process.env.TZ = 'Asia/Ho_Chi_Minh';
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    let userId = req.body.userId;
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let config = require('config');
    
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');

    let orderId = moment(date).format('YYYYMMDDHHmmss');
    let amount = req.body.total;
    let bankCode = null;
    let currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'billpayment';
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
    // const objReturn = {
    //     userId: userId,
    //     url: urlCreate,
    // }
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
module.exports = orderControllers;