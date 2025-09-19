const mongoose = require("mongoose");

const orderSChema = new mongoose.Schema({
    userId:{
        type: String,
        require: true,
    },
    userName:{
        type: String,
        require: true,
    },
    phone:{
        type: String,
        require: true,
    },
    address:{
        type: String,
        require: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            priceSale:{
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment",
    },
    shippingCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ShippingCompany",
        require: true,
    },
    orderTracking: {
        type: Number,
        require: true,
    },
    shipPrice:{
        type: String,
        require: true
    },
    total:{
        type: String,
        require: true
    },
    note:{
        type: String
    },
    shippingStatus: {
        type: Boolean,
        default: false
    },
    paymentStatus:{
        type: Boolean,
        default: false
    },
    status:{
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Order", orderSChema);