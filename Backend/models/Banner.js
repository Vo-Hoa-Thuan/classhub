const mongoose = require("mongoose");

const bannerSChema = new mongoose.Schema({
    name: { type: String, require: true },
    textHighLight: { type: String, require: true },
    desc: { type: String, require: true },
    textBtn: { type: String, require: true },
    imageUrl: { type: String, require: true },
    position: { type: String, require: true },
    offBanner: { type: Boolean, default: true },
    linkBanner: { type: String, default: true },
},
{timestamps: true}
);
module.exports = mongoose.model("Banner", bannerSChema)