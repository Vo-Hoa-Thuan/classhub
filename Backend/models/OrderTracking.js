const mongoose = require("mongoose");

const orderTrackingSChema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    codeStatus:{
        type: Number,
        require: true,
        unique: true
    },
    status:{
        type: Boolean,
        default: true
    }
},
{timestamps: true}
);

module.exports = mongoose.model("OrderTracking", orderTrackingSChema);