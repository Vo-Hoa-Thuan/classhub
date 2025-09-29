const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    userData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 phút
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Tự động xóa document sau khi hết hạn
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Tạo index cho token để tìm kiếm nhanh
emailVerificationSchema.index({ token: 1 });

// Tạo index cho email
emailVerificationSchema.index({ email: 1 });

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
