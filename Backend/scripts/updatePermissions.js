const mongoose = require('mongoose');
const User = require('../models/User');
const rolePermissionService = require('../services/rolePermissionService');

// Kết nối database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classhub');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Cập nhật permissions cho tất cả users
const updateAllPermissions = async () => {
    try {
        console.log('🔄 Updating permissions for all users...');
        
        const users = await User.find({});
        let updatedCount = 0;
        
        for (const user of users) {
            if (user.role) {
                console.log(`📝 Updating user: ${user.email} (${user.role})`);
                
                // Gán permissions dựa trên role
                rolePermissionService.assignPermissionsByRole(user, user.role);
                await user.save();
                
                console.log(`✅ Updated permissions for ${user.email}:`, user.permissions);
                updatedCount++;
            } else {
                console.log(`⚠️ User ${user.email} has no role, skipping...`);
            }
        }
        
        console.log(`🎉 Successfully updated permissions for ${updatedCount} users`);
        
        // Hiển thị thống kê
        const adminUsers = await User.find({ role: 'admin' });
        const userUsers = await User.find({ role: 'user' });
        const adminBloggerUsers = await User.find({ role: 'adminBlogger' });
        
        console.log('\n📊 Statistics:');
        console.log(`- Total users: ${users.length}`);
        console.log(`- Admin users: ${adminUsers.length}`);
        console.log(`- User users: ${userUsers.length}`);
        console.log(`- Admin Blogger users: ${adminBloggerUsers.length}`);
        
        // Kiểm tra quyền canApprovePosts của admin
        console.log('\n🔍 Admin permissions check:');
        adminUsers.forEach(admin => {
            console.log(`- ${admin.email}: canApprovePosts = ${admin.permissions?.canApprovePosts}`);
        });
        
    } catch (error) {
        console.error('❌ Error updating permissions:', error);
    }
};

// Chạy script
const run = async () => {
    await connectDB();
    await updateAllPermissions();
    process.exit(0);
};

run();
