const authControllers = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");
const mailController = require("../controllers/mailController");
const { validateRegister, validateLogin, validateRefreshToken } = require("../middleware/validation");

const router = require("express").Router();

//Register
router.post("/register", validateRegister, authControllers.registerUser);

//Login
router.post("/login", validateLogin, authControllers.loginUser);

//Verify Email
router.get("/verify-email/:token", authControllers.verifyEmail);

//Resend Verification Email
router.post("/resend-verification", authControllers.resendVerificationEmail);

//Check Password
router.post("/check-password",authControllers.checkPassword);

//Check Token
router.post("/check-token",middlewareControllers.checkToken);

//Check Admin Token
router.post("/check-admin",middlewareControllers.checkTokenAdmin);

//Refresh Token
router.post('/refresh', validateRefreshToken, authControllers.refreshToken);

//Logout
router.post('/logout', authControllers.logoutUser);

//Logout All Sessions
router.post('/logout-all', middlewareControllers.vertifyToken, authControllers.logoutAllSessions);

//Get User Sessions
router.get('/sessions', middlewareControllers.vertifyToken, authControllers.getUserSessions);

//Get Current User
router.get('/me', middlewareControllers.vertifyToken, authControllers.getCurrentUser);

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Tạo reset token
    const { token } = await mailController.createResetToken(email);
    
    // Tạo reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    
    // Gửi email
    await mailController.sendResetPasswordEmail(email, resetUrl);

    res.json({
      success: true,
      message: 'Đã gửi link đặt lại mật khẩu đến email của bạn'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Có lỗi xảy ra, vui lòng thử lại'
    });
  }
});

// Verify Reset Token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const result = await mailController.verifyResetToken(token);
    
    res.json({
      success: true,
      message: 'Token hợp lệ',
      email: result.email
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Token không hợp lệ'
    });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Xác thực token
    const { email } = await mailController.verifyResetToken(token);
    
    // Cập nhật mật khẩu
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await require('../models/User').findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );
    
    // Đánh dấu token đã sử dụng
    await mailController.markTokenAsUsed(token);

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Có lỗi xảy ra, vui lòng thử lại'
    });
  }
});

module.exports = router;