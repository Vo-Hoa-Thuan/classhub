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
    isVerified: {
        type: Boolean,
        default: false
    },
    // Role system - chỉ một role được active
    role: {
        type: String,
        enum: ['user', 'adminBlogger', 'productManager', 'admin'],
        default: 'user'
    },
    // Permissions chi tiết
    permissions: {
        // Product Manager permissions
        canConfirmOrders: {
            type: Boolean,
            default: false
        },
        canCancelOrders: {
            type: Boolean,
            default: false
        },
        canManageProducts: {
            type: Boolean,
            default: false
        },
        
        // Blogger permissions
        canCreatePosts: {
            type: Boolean,
            default: false
        },
        canEditPosts: {
            type: Boolean,
            default: false
        },
        canDeletePosts: {
            type: Boolean,
            default: false
        },
        canManageTopics: {
            type: Boolean,
            default: false
        },
        canApprovePosts: {
            type: Boolean,
            default: false
        },
        
        // Admin permissions
        canManageUsers: {
            type: Boolean,
            default: false
        },
        canAssignRoles: {
            type: Boolean,
            default: false
        },
        canManageBanners: {
            type: Boolean,
            default: false
        },
        canManagePaymentMethods: {
            type: Boolean,
            default: false
        },
        canManageShipping: {
            type: Boolean,
            default: false
        },
        canViewAnalytics: {
            type: Boolean,
            default: false
        }
    },
    
    // Legacy fields - giữ để tương thích ngược
    admin:{
        type: Boolean,
        default: false
    },
    blogger:{
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

module.exports = mongoose.model("User", userSChema)