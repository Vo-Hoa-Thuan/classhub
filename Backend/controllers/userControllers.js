const User = require("../models/User")
const Order = require("../models/Order")
const OrderApp = require("../models/OrderApp")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userControllers = {
    getUser: async(req,res,next) => {
        try {
            const user = await User.findById(req.params.id).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    },
    //Get All User
    getAllUser: async(req,res,next) =>{
        try {
            const users = await User.find().select("-password");
            res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async(req,res,next) =>{
        try {
            const Order = require("../models/Order");
            const OrderApp = require("../models/OrderApp");
            const Blog = require("../models/Blog");
            const RefreshToken = require("../models/RefreshToken");
            
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Đếm số đơn hàng và bài viết trước khi xóa
            const orderCount = await Order.countDocuments({ userId: req.params.id });
            const orderAppCount = await OrderApp.countDocuments({ user: req.params.id });
            const blogCount = await Blog.countDocuments({ authorId: req.params.id });
            const tokenCount = await RefreshToken.countDocuments({ userId: req.params.id });
            const totalOrders = orderCount + orderAppCount;

            // Xóa tất cả đơn hàng liên quan
            if (orderCount > 0) {
                await Order.deleteMany({ userId: req.params.id });
            }
            if (orderAppCount > 0) {
                await OrderApp.deleteMany({ user: req.params.id });
            }

            // Xóa tất cả bài viết liên quan
            if (blogCount > 0) {
                await Blog.deleteMany({ authorId: req.params.id });
            }

            // Xóa tất cả refresh tokens
            if (tokenCount > 0) {
                await RefreshToken.deleteMany({ userId: req.params.id });
            }

            // Xóa user
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: `User deleted successfully. Deleted ${totalOrders} orders, ${blogCount} blogs, and ${tokenCount} refresh tokens.`,
                deletedData: {
                    orders: totalOrders,
                    blogs: blogCount,
                    tokens: tokenCount,
                    total: totalOrders + blogCount + tokenCount
                },
                userInfo: {
                    name: user.fullname,
                    email: user.email,
                    phone: user.phone
                }
            });
        } catch (error) {
            next(error);
        }
    },
    //Get User Order Details for Deletion Confirmation
    getUserOrderDetails: async(req,res,next) =>{
        try {
            const Order = require("../models/Order");
            const OrderApp = require("../models/OrderApp");
            const Blog = require("../models/Blog");
            const RefreshToken = require("../models/RefreshToken");
            
            const user = await User.findById(req.params.id).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Đếm số đơn hàng, blogs và tokens
            const orderCount = await Order.countDocuments({ userId: req.params.id });
            const orderAppCount = await OrderApp.countDocuments({ user: req.params.id });
            const blogCount = await Blog.countDocuments({ authorId: req.params.id });
            const tokenCount = await RefreshToken.countDocuments({ userId: req.params.id });
            const totalOrders = orderCount + orderAppCount;

            // Lấy thông tin chi tiết về trạng thái đơn hàng
            const orders = await Order.find({ userId: req.params.id }).select('status paymentStatus shippingStatus createdAt');
            const orderApps = await OrderApp.find({ user: req.params.id }).select('status paymentStatus createdAt');

            // Thống kê trạng thái đơn hàng
            const orderStats = {
                total: totalOrders,
                orders: {
                    count: orderCount,
                    paid: orders.filter(o => o.paymentStatus).length,
                    shipped: orders.filter(o => o.shippingStatus).length,
                    completed: orders.filter(o => o.status).length,
                    pending: orders.filter(o => !o.status).length
                },
                orderApps: {
                    count: orderAppCount,
                    paid: orderApps.filter(o => o.paymentStatus).length,
                    completed: orderApps.filter(o => o.status).length,
                    pending: orderApps.filter(o => !o.status).length
                }
            };

            res.status(200).json({
                success: true,
                userInfo: {
                    id: user._id,
                    name: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                },
                orderDetails: orderStats,
                additionalData: {
                    blogs: blogCount,
                    tokens: tokenCount,
                    totalRelatedData: totalOrders + blogCount + tokenCount
                }
            });
        } catch (error) {
            next(error);
        }
    },
    //Get Users with Orders
    getUsersWithOrders: async(req,res,next) =>{
        try {
            const Order = require("../models/Order");
            const OrderApp = require("../models/OrderApp");
            
            // Lấy tất cả user có đơn hàng từ cả Order và OrderApp
            const orderUserIds = await Order.distinct("userId");
            const orderAppUserIds = await OrderApp.distinct("user");
            
            // Kết hợp và loại bỏ trùng lặp
            const allUserIds = [...new Set([...orderUserIds, ...orderAppUserIds])];
            
            // Lấy thông tin user và đếm số đơn hàng
            const usersWithOrders = await Promise.all(
                allUserIds.map(async (userId) => {
                    const user = await User.findById(userId).select("-password");
                    if (!user) return null;
                    
                    // Đếm số đơn hàng từ Order
                    const orderCount = await Order.countDocuments({ userId: userId });
                    
                    // Đếm số đơn hàng từ OrderApp
                    const orderAppCount = await OrderApp.countDocuments({ user: userId });
                    
                    const totalOrders = orderCount + orderAppCount;
                    
                    return {
                        ...user.toObject(),
                        totalOrders: totalOrders,
                        orderCount: orderCount,
                        orderAppCount: orderAppCount
                    };
                })
            );
            
            // Lọc bỏ null values và chỉ lấy user thường (không phải admin/blogger)
            const filteredUsers = usersWithOrders
                .filter(user => user && user.admin === false && user.blogger === false)
                .sort((a, b) => b.totalOrders - a.totalOrders); // Sắp xếp theo số đơn hàng giảm dần
            
            res.status(200).json({
                success: true,
                count: filteredUsers.length,
                data: filteredUsers
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Get user order details before deletion
    getUserOrderDetails: async(req,res,next) =>{
        try {
            const userId = req.params.id;
            
            // Find user
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Get order statistics
            const orders = await Order.find({ userId: userId });
            const orderApps = await OrderApp.find({ user: userId });

            // Count orders by status
            const orderStats = {
                count: orders.length,
                paid: orders.filter(order => order.status === 'paid').length,
                shipped: orders.filter(order => order.status === 'shipped').length,
                completed: orders.filter(order => order.status === 'completed').length,
                pending: orders.filter(order => order.status === 'pending').length,
                cancelled: orders.filter(order => order.status === 'cancelled').length
            };

            // Count order apps by status
            const orderAppStats = {
                count: orderApps.length,
                paid: orderApps.filter(order => order.status === 'paid').length,
                completed: orderApps.filter(order => order.status === 'completed').length,
                pending: orderApps.filter(order => order.status === 'pending').length,
                cancelled: orderApps.filter(order => order.status === 'cancelled').length
            };

            const totalOrders = orderStats.count + orderAppStats.count;

            res.status(200).json({
                success: true,
                userInfo: {
                    name: user.fullname,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                },
                orderDetails: {
                    total: totalOrders,
                    orders: orderStats,
                    orderApps: orderAppStats
                }
            });
        } catch (error) {
            next(error);
        }
    },
    
    updateUser: async(req,res,next) =>{
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check for duplicate email (excluding current user)
            if (req.body.email && req.body.email !== user.email) {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
            }

            // Check for duplicate phone (excluding current user)
            if (req.body.phone && req.body.phone !== user.phone) {
                const existingUser = await User.findOne({ phone: req.body.phone });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Phone number already exists"
                    });
                }
            }

            // Prepare update data
            const updateData = { ...req.body };
            
            // Hash password if provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(12);
                updateData.password = await bcrypt.hash(req.body.password, salt);
            }

            // Remove confirmPassword from update data
            delete updateData.confirmPassword;
            
            const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { 
                new: true,
                runValidators: true 
            }).select("-password");

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },
}
module.exports = userControllers;