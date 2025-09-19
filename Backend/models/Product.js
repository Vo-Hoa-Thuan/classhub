const mongoose = require("mongoose");

const productSChema = new mongoose.Schema({
    name: { type: String, require: true },
    imageUrl: { type: String, require: true },
    imagesSub: { type: [String], require: true, default: []},
    videoUrl: { type: String, require: true },
    price: { type: Number, require: true },
    saleOff: { type: Number, default: 0 },
    quantity: { type: Number, default:0 },
    purchased: { type: Number, default: 0 },
    software: { type: Boolean, require: true },
    linkDownload: { type: String },
    desc: { type: String, require: true },
    status: {type: Boolean, require: true, default: true},
},
{timestamps: true}
);
module.exports = mongoose.model("Product", productSChema)