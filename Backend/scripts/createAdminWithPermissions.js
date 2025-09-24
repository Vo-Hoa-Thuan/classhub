const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const rolePermissionService = require('../services/rolePermissionService');
require('dotenv').config();

async function createAdminWithPermissions() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB...');

        const adminData = {
            email: 'admin@classhub.com',
            password: 'admin123456',
            fullname: 'System Administrator',
            phone: '0123456789',
            gender: 'male',
            address: 'System Address',
            birth: new Date('1990-01-01')
        };

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating permissions...');
            
            // Cập nhật role và permissions
            rolePermissionService.assignPermissionsByRole(existingAdmin, 'admin');
            await existingAdmin.save();
            
            console.log('Admin permissions updated successfully!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            console.log('Permissions:', existingAdmin.permissions);
        } else {
            // Tạo admin mới
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(adminData.password, salt);

            const newAdmin = new User({
                ...adminData,
                password: hashedPassword
            });

            // Gán role admin và permissions
            rolePermissionService.assignPermissionsByRole(newAdmin, 'admin');

            await newAdmin.save();

            console.log('Admin created successfully!');
            console.log('Email:', newAdmin.email);
            console.log('Password:', adminData.password);
            console.log('Role:', newAdmin.role);
            console.log('Permissions:', newAdmin.permissions);
        }

        // Tạo Product Manager mẫu
        const productManagerData = {
            email: 'productmanager@classhub.com',
            password: 'pm123456',
            fullname: 'Product Manager',
            phone: '0123456788',
            gender: 'female',
            address: 'Product Manager Address',
            birth: new Date('1985-05-15')
        };

        const existingPM = await User.findOne({ email: productManagerData.email });
        if (!existingPM) {
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
            console.log('Role:', newPM.role);
            console.log('Permissions:', newPM.permissions);
        }

        // Tạo Blogger mẫu
        const bloggerData = {
            email: 'blogger@classhub.com',
            password: 'blog123456',
            fullname: 'Content Blogger',
            phone: '0123456787',
            gender: 'male',
            address: 'Blogger Address',
            birth: new Date('1992-08-20')
        };

        const existingBlogger = await User.findOne({ email: bloggerData.email });
        if (!existingBlogger) {
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
            console.log('Role:', newBlogger.role);
            console.log('Permissions:', newBlogger.permissions);
        }

        console.log('\n=== All accounts created successfully! ===');
        console.log('You can now test the permission system with these accounts.');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Chạy script nếu file được gọi trực tiếp
if (require.main === module) {
    createAdminWithPermissions();
}

module.exports = createAdminWithPermissions;
