const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');

class RefreshTokenService {
    // Generate a secure random refresh token
    static generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    // Create a new refresh token for user
    static async createRefreshToken(userId, userAgent = '', ipAddress = '') {
        try {
            // Revoke all existing tokens for this user
            await this.revokeAllUserTokens(userId);

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

    // Verify refresh token and return user info
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
    static async generateAccessToken(refreshToken) {
        try {
            const user = await this.verifyRefreshToken(refreshToken);
            
            // Generate new access token
            const accessToken = jwt.sign(
                { 
                    id: user._id,
                    isAdmin: user.isAdmin,
                    type: 'access'
                },
                process.env.JWT_ACCESS_KEY || 'HJAWJBFUAHWUFHUANWDUNWAUXCNAWHJAWJBFUAHWUFHUANWDUNWAUXCNAW',
                { expiresIn: '15m' } // Access token expires in 15 minutes
            );

            return { accessToken, user };
        } catch (error) {
            throw new Error(`Failed to generate access token: ${error.message}`);
        }
    }

    // Revoke a specific refresh token
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

    // Revoke all refresh tokens for a user
    static async revokeAllUserTokens(userId) {
        try {
            await RefreshToken.updateMany(
                { userId, isRevoked: false },
                { isRevoked: true }
            );
            return true;
        } catch (error) {
            throw new Error(`Failed to revoke user tokens: ${error.message}`);
        }
    }

    // Clean up expired tokens
    static async cleanupExpiredTokens() {
        try {
            const result = await RefreshToken.cleanupExpiredTokens();
            return result;
        } catch (error) {
            throw new Error(`Failed to cleanup expired tokens: ${error.message}`);
        }
    }

    // Get all active tokens for a user
    static async getUserActiveTokens(userId) {
        try {
            const tokens = await RefreshToken.find({
                userId,
                isRevoked: false,
                expiresAt: { $gt: new Date() }
            }).select('createdAt lastUsedAt userAgent ipAddress');

            return tokens;
        } catch (error) {
            throw new Error(`Failed to get user tokens: ${error.message}`);
        }
    }

    // Revoke all other sessions (keep current one)
    static async revokeOtherSessions(userId, currentToken) {
        try {
            await RefreshToken.updateMany(
                { 
                    userId, 
                    token: { $ne: currentToken },
                    isRevoked: false 
                },
                { isRevoked: true }
            );
            return true;
        } catch (error) {
            throw new Error(`Failed to revoke other sessions: ${error.message}`);
        }
    }
}

module.exports = RefreshTokenService;
