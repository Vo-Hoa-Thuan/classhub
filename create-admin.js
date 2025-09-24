const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (copy from User.js)
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 11,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    image: {
        type: String,
        default: ''
    },
    fullname: {
        type: String,
        require: true,
        minlength: 6,
        maxlength: 100
    },
    phone: {
        type: String,
        require: true,
        minlength: 9,
        maxlength: 15,
        unique: true
    },
    birth: {
        type: Date
    },
    gender: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true,
        maxlength: 500
    },
    admin: {
        type: Boolean,
        default: false
    },
    blogger: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/classhub', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ admin: true });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            email: 'admin@classhub.com',
            password: hashedPassword,
            fullname: 'Administrator',
            phone: '0123456789',
            gender: 'Nam',
            address: 'Hà Nội, Việt Nam',
            admin: true,
            blogger: false
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@classhub.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createAdmin();
