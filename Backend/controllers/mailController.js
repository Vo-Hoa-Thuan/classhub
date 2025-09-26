const sgMail = require('@sendgrid/mail');
const ResetToken = require('../models/ResetToken');
const User = require('../models/User');
const crypto = require('crypto');

// Cấu hình SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Tạo HTML template cho email reset password
const createResetPasswordEmail = ( resetUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đặt lại mật khẩu - ClassHub</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .expiry {
                background: #e3f2fd;
                border: 1px solid #bbdefb;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #1565c0;
            }
        </style>
    </head>
<body>
        <div class="container">
            <div class="header">
                <div class="logo">🎓 ClassHub</div>
                <h1 class="title">Đặt lại mật khẩu</h1>
            </div>
            
            <div class="content">
                <p>Xin chào,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ClassHub của bạn.</p>
                <p>Để đặt lại mật khẩu, vui lòng nhấn vào nút bên dưới:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
                </div>
                
                <div class="expiry">
                    <strong>⏰ Lưu ý:</strong> Link này sẽ hết hạn sau 15 phút để đảm bảo bảo mật.
                </div>
                
                <div class="warning">
                    <strong>⚠️ Cảnh báo bảo mật:</strong>
                    <ul>
                        <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                        <li>Không chia sẻ link này với bất kỳ ai</li>
                        <li>Link chỉ có thể sử dụng một lần duy nhất</li>
                    </ul>
                </div>
                
                <p>Nếu nút không hoạt động, bạn có thể copy và paste link sau vào trình duyệt:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
                    ${resetUrl}
                </p>
            </div>
            
            <div class="footer">
                <p>Trân trọng,<br><strong>Đội ngũ ClassHub</strong></p>
                <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                <p>© 2025 ClassHub. Tất cả quyền được bảo lưu.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Gửi email reset password
const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com',
        name: 'ClassHub'
      },
      subject: '🔐 Đặt lại mật khẩu - ClassHub',
      html: createResetPasswordEmail(resetUrl)
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    return { success: true, messageId: result[0].headers['x-message-id'] };
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

// Tạo reset token
const createResetToken = async (email) => {
  try {
    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Email không tồn tại trong hệ thống');
}

    // Xóa token cũ nếu có
    await ResetToken.deleteMany({ email });

    // Tạo token mới
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    const resetToken = new ResetToken({
      email,
      token,
      expiresAt
    });

    await resetToken.save();

    return { token, expiresAt };
  } catch (error) {
    console.error('Error creating reset token:', error);
    throw error;
  }
};

// Xác thực reset token
const verifyResetToken = async (token) => {
  try {
    const resetToken = await ResetToken.findOne({ 
      token, 
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }

    return { valid: true, email: resetToken.email };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    throw error;
  }
};

// Đánh dấu token đã sử dụng
const markTokenAsUsed = async (token) => {
  try {
    await ResetToken.findOneAndUpdate(
      { token },
      { used: true }
    );
  } catch (error) {
    console.error('Error marking token as used:', error);
    throw error;
  }
};

// Xóa token hết hạn (cleanup job)
const cleanupExpiredTokens = async () => {
  try {
    const result = await ResetToken.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { used: true }
      ]
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired tokens`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    throw error;
  }
};

module.exports = {
  sendResetPasswordEmail,
  createResetToken,
  verifyResetToken,
  markTokenAsUsed,
  cleanupExpiredTokens
};