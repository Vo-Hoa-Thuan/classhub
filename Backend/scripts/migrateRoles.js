const mongoose = require('mongoose');
const User = require('../models/User');
const rolePermissionService = require('../services/rolePermissionService');
require('dotenv').config();

async function migrateRoles() {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB...');

        // Lấy tất cả users
        const users = await User.find({});
        console.log(`Found ${users.length} users to migrate...`);

        let migratedCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                let newRole = 'user';
                let permissions = {};

                // Xác định role dựa trên legacy fields
                if (user.admin === true) {
                    newRole = 'admin';
                } else if (user.blogger === true) {
                    newRole = 'blogger';
                } else {
                    newRole = 'user';
                }

                // Gán permissions dựa trên role
                rolePermissionService.assignPermissionsByRole(user, newRole);

                // Lưu user
                await user.save();
                migratedCount++;

                console.log(`Migrated user ${user.email}: ${user.admin ? 'admin' : user.blogger ? 'blogger' : 'user'} -> ${newRole}`);

            } catch (error) {
                console.error(`Error migrating user ${user.email}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total users: ${users.length}`);
        console.log(`Successfully migrated: ${migratedCount}`);
        console.log(`Errors: ${errorCount}`);

        // Hiển thị thống kê roles sau migration
        const roleStats = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n=== Role Distribution After Migration ===');
        roleStats.forEach(stat => {
            console.log(`${stat._id}: ${stat.count} users`);
        });

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Chạy migration nếu file được gọi trực tiếp
if (require.main === module) {
    migrateRoles();
}

module.exports = migrateRoles;
