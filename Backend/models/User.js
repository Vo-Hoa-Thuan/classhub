const mongoose = require("mongoose");

const userSChema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        minlength: 11,
        maxlength: 100,
        unique: true
    },
    password:{
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    image:{
        type: String,
        default:''
    },
    fullname:{
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    phone:{
        type: String,
        require: true,
        minlength: 9,
        maxlength: 15,
        unique: true
    },
    birth:{
        type: Date
    },
    gender:{
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true,
        maxlength: 500
    },
    admin:{
        type: Boolean,
        default: false
    },
    blogger:{
        type: Boolean,
        default: false
    }
    // staff:{
    //     type: Boolean,
    //     default: false
    // }
},
{timestamps: true}
);

module.exports = mongoose.model("User", userSChema)