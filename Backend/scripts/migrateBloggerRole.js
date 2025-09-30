const mongoose = require('mongoose');
const User = require('../models/User');
const rolePermissionService = require('../services/rolePermissionService');

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classhub');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const migrateBloggerRole = async () => {
    try {
        console.log('🔄 Starting blogger role migration...');
        
        // Tìm tất cả user có role 'blogger' cũ
        const bloggerUsers = await User.find({ role: 'blogger' });
        console.log(`📊 Found ${bloggerUsers.length} users with old 'blogger' role`);
        
        if (bloggerUsers.length === 0) {
            console.log('✅ No users with old blogger role found. Migration complete!');
            return;
        }
        
        // Cập nhật từng user
        let updatedCount = 0;
        for (const user of bloggerUsers) {
            console.log(`🔄 Updating user: ${user.email} (${user.fullname})`);
            
            // Cập nhật role thành adminBlogger
            user.role = 'adminBlogger';
            
            // Gán permissions mới cho adminBlogger
            rolePermissionService.assignPermissionsByRole(user, 'adminBlogger');
            
            await user.save();
            updatedCount++;
            
            console.log(`✅ Updated ${user.email} to adminBlogger role`);
        }
        
        console.log(`🎉 Successfully migrated ${updatedCount} users from 'blogger' to 'adminBlogger'`);
        
        // Hiển thị thống kê sau migration
        const adminBloggerUsers = await User.find({ role: 'adminBlogger' });
        const userUsers = await User.find({ role: 'user' });
        const adminUsers = await User.find({ role: 'admin' });
        
        console.log('\n📊 Final Statistics:');
        console.log(`- Total users: ${await User.countDocuments()}`);
        console.log(`- User users: ${userUsers.length}`);
        console.log(`- Admin Blogger users: ${adminBloggerUsers.length}`);
        console.log(`- Admin users: ${adminUsers.length}`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};

// Chạy migration
connectDB().then(() => {
    migrateBloggerRole();
});
