const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

class TokenService {
    // Generate secure refresh token
    static generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    // Generate access token
    static generateAccessToken(user) {
        return jwt.sign(
            { 
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                type: 'access'
            },
            process.env.JWT_ACCESS_KEY || 'HJAWJBFUAHWUFHUANWDUNWAUXCNAW',
            { expiresIn: '15m' }
        );
    }

    // Create refresh token and save to database
    static async createRefreshToken(userId, userAgent = '', ipAddress = '') {
        try {
            // Revoke all existing tokens for this user (single session)
            await RefreshToken.revokeUserTokens(userId);

            const token = this.generateRefreshToken();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            const refreshToken = new RefreshToken({
                token,
                userId,
                expiresAt,
                userAgent,
                ipAddress
            });

            await refreshToken.save();
            return refreshToken;
        } catch (error) {
            throw new Error(`Failed to create refresh token: ${error.message}`);
        }
    }

    // Verify refresh token from database
    static async verifyRefreshToken(token) {
        try {
            const refreshToken = await RefreshToken.findOne({ token }).populate('userId');
            
            if (!refreshToken) {
                throw new Error('Invalid refresh token');
            }

            if (!refreshToken.isValid()) {
                throw new Error('Refresh token has expired or been revoked');
            }

            // Update last used timestamp
            refreshToken.lastUsedAt = new Date();
            await refreshToken.save();

            return refreshToken.userId;
        } catch (error) {
            throw new Error(`Invalid refresh token: ${error.message}`);
        }
    }

    // Generate new access token using refresh token
    static async refreshAccessToken(refreshToken) {
        try {
            const user = await this.verifyRefreshToken(refreshToken);
            const accessToken = this.generateAccessToken(user);
            
            return { accessToken, user };
        } catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }

    // Revoke refresh token
    static async revokeRefreshToken(token) {
        try {
            const refreshToken = await RefreshToken.findOne({ token });
            if (refreshToken) {
                await refreshToken.revoke();
            }
            return true;
        } catch (error) {
            throw new Error(`Failed to revoke refresh token: ${error.message}`);
        }
    }

    // Revoke all user tokens
    static async revokeAllUserTokens(userId) {
        try {
            await RefreshToken.revokeUserTokens(userId);
            return true;
        } catch (error) {
            throw new Error(`Failed to revoke user tokens: ${error.message}`);
        }
    }

    // Cleanup expired tokens
    static async cleanupExpiredTokens() {
        try {
            const result = await RefreshToken.cleanupExpiredTokens();
            return result;
        } catch (error) {
            throw new Error(`Failed to cleanup expired tokens: ${error.message}`);
        }
    }

    // Get user active sessions
    static async getUserSessions(userId) {
        try {
            const sessions = await RefreshToken.find({
                userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() }
            }).select('createdAt lastUsedAt userAgent ipAddress');

            return sessions;
        } catch (error) {
            throw new Error(`Failed to get user sessions: ${error.message}`);
        }
    }
}

module.exports = TokenService;
