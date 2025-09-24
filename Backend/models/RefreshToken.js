const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    userAgent: {
        type: String,
        default: ""
    },
    ipAddress: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Index for better performance
RefreshTokenSchema.index({ token: 1 });
RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to clean up expired tokens
RefreshTokenSchema.statics.cleanupExpiredTokens = async function() {
    return await this.deleteMany({
        $or: [
            { expiresAt: { $lt: new Date() } },
            { isRevoked: true }
        ]
    });
};

// Instance method to check if token is valid
RefreshTokenSchema.methods.isValid = function() {
    return !this.isRevoked && this.expiresAt > new Date();
};

// Instance method to revoke token
RefreshTokenSchema.methods.revoke = function() {
    this.isRevoked = true;
    return this.save();
};

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
