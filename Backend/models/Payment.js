const mongoose = require("mongoose");

const paymentSChema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    apiSecret: {
        type: String,
        required: true
    },
    urlAPI: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    webUrl: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    isbank: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Payment", paymentSChema);