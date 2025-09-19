const mongoose = require("mongoose");

const orderAppSChema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    product: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment",
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

module.exports = mongoose.model("OrderApp", orderAppSChema);