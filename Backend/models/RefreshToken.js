const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // TTL index
    },
    isRevoked: {
        type: Boolean,
        default: false,
        index: true
    },
    userAgent: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better performance
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });
refreshTokenSchema.index({ token: 1, isRevoked: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance methods
refreshTokenSchema.methods.isValid = function() {
    return !this.isRevoked && this.expiresAt > new Date();
};

refreshTokenSchema.methods.revoke = function() {
    this.isRevoked = true;
    return this.save();
};

// Static methods
refreshTokenSchema.statics.cleanupExpiredTokens = async function() {
    const result = await this.deleteMany({
        $or: [
            { expiresAt: { $lt: new Date() } },
            { isRevoked: true }
        ]
    });
    return result;
};

refreshTokenSchema.statics.revokeUserTokens = async function(userId) {
    const result = await this.updateMany(
        { userId, isRevoked: false },
        { isRevoked: true }
    );
    return result;
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);