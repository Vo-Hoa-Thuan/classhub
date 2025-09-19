const mongoose = require("mongoose");

const topicSChema = new mongoose.Schema({
    title:{ type: String, require: true },
    desc:{type: String},
    status:{type: Boolean,default: true}
},
{timestamps: true}
);

module.exports = mongoose.model("Topic", topicSChema);