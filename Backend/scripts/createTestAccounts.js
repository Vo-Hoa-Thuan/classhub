const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const rolePermissionService = require('../services/rolePermissionService');
require('dotenv').config();

async function createTestAccounts() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB...');

        // Tạo Admin mới
        const adminData = {
            email: 'admin@classhub.com',
            password: 'admin123456',
            fullname: 'System Administrator',
            phone: '0987654321',
            gender: 'male',
            address: 'System Address',
            birth: new Date('1990-01-01')
        };

        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating permissions...');
            rolePermissionService.assignPermissionsByRole(existingAdmin, 'admin');
            await existingAdmin.save();
            console.log('Admin permissions updated successfully!');
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            const newAdmin = new User({
                ...adminData,
                password: hashedPassword
            });

            rolePermissionService.assignPermissionsByRole(newAdmin, 'admin');
            await newAdmin.save();

            console.log('Admin created successfully!');
            console.log('Email:', newAdmin.email);
            console.log('Password:', adminData.password);
        }

        // Tạo Product Manager mới
        const productManagerData = {
            email: 'productmanager@classhub.com',
            password: 'pm123456',
            fullname: 'Product Manager',
            phone: '0987654322',
            gender: 'female',
            address: 'Product Manager Address',
            birth: new Date('1985-05-15')
        };

        const existingPM = await User.findOne({ email: productManagerData.email });
        if (existingPM) {
            console.log('Product Manager already exists. Updating permissions...');
            rolePermissionService.assignPermissionsByRole(existingPM, 'productManager');
            await existingPM.save();
            console.log('Product Manager permissions updated successfully!');
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(productManagerData.password, salt);

            const newPM = new User({
                ...productManagerData,
                password: hashedPassword
            });

            rolePermissionService.assignPermissionsByRole(newPM, 'productManager');
            await newPM.save();

            console.log('\nProduct Manager created successfully!');
            console.log('Email:', newPM.email);
            console.log('Password:', productManagerData.password);
        }

        // Tạo Blogger mới
        const bloggerData = {
            email: 'blogger@classhub.com',
            password: 'blog123456',
            fullname: 'Content Blogger',
            phone: '0987654323',
            gender: 'male',
            address: 'Blogger Address',
            birth: new Date('1992-08-20')
        };

        const existingBlogger = await User.findOne({ email: bloggerData.email });
        if (existingBlogger) {
            console.log('Blogger already exists. Updating permissions...');
            rolePermissionService.assignPermissionsByRole(existingBlogger, 'blogger');
            await existingBlogger.save();
            console.log('Blogger permissions updated successfully!');
        } else {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(bloggerData.password, salt);

            const newBlogger = new User({
                ...bloggerData,
                password: hashedPassword
            });

            rolePermissionService.assignPermissionsByRole(newBlogger, 'blogger');
            await newBlogger.save();

            console.log('\nBlogger created successfully!');
            console.log('Email:', newBlogger.email);
            console.log('Password:', bloggerData.password);
        }

        console.log('\n=== All test accounts ready! ===');
        console.log('Admin: admin@classhub.com / admin123456');
        console.log('Product Manager: productmanager@classhub.com / pm123456');
        console.log('Blogger: blogger@classhub.com / blog123456');

        // Hiển thị thống kê roles
        const roleStats = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n=== Current Role Distribution ===');
        roleStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} users`);
        });

    } catch (error) {
        console.error('Error creating test accounts:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Chạy script nếu file được gọi trực tiếp
if (require.main === module) {
    createTestAccounts();
}

module.exports = createTestAccounts;
