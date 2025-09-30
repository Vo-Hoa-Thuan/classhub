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
    // Hệ thống duyệt bài
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }
},
{timestamps: true}
);
module.exports = mongoose.model("Blog", blogSChema)