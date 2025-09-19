const mongoose = require("mongoose");

const blogSChema = new mongoose.Schema({
    topic: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Topic",
        require: true,
    },
    title: { type: String, require: true },
    shortDesc: { type: String, require: true },
    desc: { type: String, require: true },
    imageUrl: { type: String, require: true },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true, },
    status: { type: Boolean, default: true },
},
{timestamps: true}
);
module.exports = mongoose.model("Blog", blogSChema)