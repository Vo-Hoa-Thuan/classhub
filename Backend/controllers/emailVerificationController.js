const sgMail = require('@sendgrid/mail');
const EmailVerification = require('../models/EmailVerification');
const User = require('../models/User');
const crypto = require('crypto');

// Store để theo dõi các token đang được xử lý
const processingTokens = new Set();

// Map để lưu trữ kết quả đã xử lý
const processedResults = new Map();

// Cấu hình SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Tạo HTML template cho email xác nhận đăng ký
const createVerificationEmail = (verificationUrl, fullname) => {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đăng ký - ClassHub</title>
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
            .success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #155724;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎓 ClassHub</div>
                <h1 class="title">Chào mừng ${fullname}!</h1>
            </div>
            
            <div class="content">
                <p>Xin chào <strong>${fullname}</strong>,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>ClassHub</strong>!</p>
                <p>Để hoàn tất quá trình đăng ký và kích hoạt tài khoản, vui lòng nhấn vào nút bên dưới:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Xác nhận tài khoản</a>
                </div>
                
                <div class="expiry">
                    <strong>⏰ Lưu ý quan trọng:</strong> Link xác nhận sẽ hết hạn sau <strong>15 phút</strong>. 
                    Nếu không xác nhận trong thời gian này, tài khoản sẽ bị xóa tự động.
                </div>
                
                <div class="success">
                    <strong>🎉 Sau khi xác nhận, bạn sẽ có thể:</strong>
                    <ul>
                        <li>Đăng nhập vào hệ thống</li>
                        <li>Mua sắm các khóa học</li>
                        <li>Theo dõi đơn hàng</li>
                        <li>Truy cập các tính năng độc quyền</li>
                    </ul>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Cảnh báo bảo mật:</strong>
                    <ul>
                        <li>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email</li>
                        <li>Không chia sẻ link xác nhận với bất kỳ ai</li>
                        <li>Link chỉ có thể sử dụng một lần duy nhất</li>
                    </ul>
                </div>
                
                <p>Nếu nút không hoạt động, bạn có thể copy và paste link sau vào trình duyệt:</p>
                <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
                    ${verificationUrl}
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

// Gửi email xác nhận đăng ký
const sendVerificationEmail = async (email, verificationUrl, fullname) => {
  try {
    console.log('📧 [EMAIL] Starting to send verification email...');
    console.log('📧 [EMAIL] To:', email);
    console.log('📧 [EMAIL] From:', process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com');
    console.log('🔗 [EMAIL] Verification URL:', verificationUrl);
    console.log('👤 [EMAIL] Fullname:', fullname);
    
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com',
        name: 'ClassHub'
      },
      subject: '🎓 Xác nhận đăng ký tài khoản - ClassHub',
      html: createVerificationEmail(verificationUrl, fullname)
    };

    console.log('📤 [EMAIL] Sending email via SendGrid...');
    console.log('🔑 [EMAIL] SendGrid API Key configured:', process.env.SENDGRID_API_KEY ? 'Yes' : 'No');
    
    const result = await sgMail.send(msg);
    console.log('✅ [EMAIL] Email sent successfully!');
    console.log('📊 [EMAIL] SendGrid response status:', result[0].statusCode);
    console.log('📧 [EMAIL] Email delivered to:', email);
    console.log('🆔 [EMAIL] Message ID:', result[0].headers['x-message-id']);
    
    return { success: true, messageId: result[0].headers['x-message-id'] };
  } catch (error) {
    console.error('❌ [EMAIL] Error sending verification email:', error.message);
    console.error('🔍 [EMAIL] Full error details:', error);
    
    if (error.response) {
      console.error('📊 [EMAIL] SendGrid error response:', error.response.body);
    }
    
    throw new Error('Không thể gửi email xác nhận. Vui lòng thử lại sau.');
  }
};

// Tạo verification token và lưu thông tin user tạm thời
const createVerificationToken = async (userData) => {
  try {
    console.log('🎫 [TOKEN] Creating verification token...');
    const { email } = userData;
    console.log('📧 [TOKEN] Email:', email);
    
    // Xóa verification cũ nếu có
    console.log('🗑️ [TOKEN] Cleaning up old verifications...');
    const deletedCount = await EmailVerification.deleteMany({ email });
    console.log('🗑️ [TOKEN] Deleted old verifications:', deletedCount.deletedCount);
    
    // Tạo token mới
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    
    console.log('🎫 [TOKEN] Token generated:', token.substring(0, 20) + '...');
    console.log('⏰ [TOKEN] Expires at:', expiresAt);
    
    const emailVerification = new EmailVerification({
      email,
      token,
      userData,
      expiresAt
    });
    
    console.log('💾 [TOKEN] Saving verification to database...');
    await emailVerification.save();
    console.log('✅ [TOKEN] Verification token created and saved successfully');
    
    // Verify the token was actually saved
    const savedVerification = await EmailVerification.findOne({ token });
    console.log('🔍 [TOKEN] Verification saved check:', savedVerification ? 'SUCCESS' : 'FAILED');
    if (savedVerification) {
        console.log('📧 [TOKEN] Saved email:', savedVerification.email);
        console.log('⏰ [TOKEN] Saved expires:', savedVerification.expiresAt);
    }
    
    return { token, expiresAt };
  } catch (error) {
    console.error('❌ [TOKEN] Error creating verification token:', error.message);
    console.error('🔍 [TOKEN] Full error:', error);
    throw error;
  }
};

// Xác thực verification token và tạo user
const verifyEmailToken = async (token) => {
  try {
    console.log('🔍 [VERIFY] Looking for verification token...');
    console.log('🎫 [VERIFY] Token to search:', token.substring(0, 20) + '...');
    console.log('⏰ [VERIFY] Current time:', new Date());
    
    // Kiểm tra xem token đã được xử lý chưa
    if (processedResults.has(token)) {
      console.log('📋 [VERIFY] Token already processed, returning cached result');
      return processedResults.get(token);
    }
    
    // Kiểm tra xem token đang được xử lý không
    if (processingTokens.has(token)) {
      console.log('⏳ [VERIFY] Token is being processed, waiting...');
      // Đợi một chút và kiểm tra lại
      await new Promise(resolve => setTimeout(resolve, 100));
      if (processedResults.has(token)) {
        return processedResults.get(token);
      }
      throw new Error('Token đang được xử lý, vui lòng thử lại sau');
    }
    
    // Đánh dấu token đang được xử lý
    processingTokens.add(token);
    
    try {
      // Tìm token (có thể đã verify hoặc chưa)
      const verification = await EmailVerification.findOne({ 
        token, 
        expiresAt: { $gt: new Date() }
      });
      
      console.log('🔍 [VERIFY] Verification found:', verification ? 'YES' : 'NO');
      
      if (verification) {
        console.log('📧 [VERIFY] Email:', verification.email);
        console.log('⏰ [VERIFY] Expires at:', verification.expiresAt);
        console.log('✅ [VERIFY] Verified status:', verification.verified);
        
        // Nếu token đã được verify trước đó
        if (verification.verified) {
          console.log('✅ [VERIFY] Token already verified, checking if user exists...');
          
          // Kiểm tra xem user đã tồn tại chưa
          const existingUser = await User.findOne({ email: verification.email });
          if (existingUser) {
            console.log('👤 [VERIFY] User already exists, returning success');
            const result = {
              success: true,
              message: 'Email đã được xác thực trước đó',
              user: existingUser
            };
            processedResults.set(token, result);
            return result;
          } else {
            throw new Error('Token đã được sử dụng nhưng user không tồn tại');
          }
        }
      } else {
        // Kiểm tra chi tiết hơn
        console.log('🔍 [VERIFY] Checking why token not found...');
        
        const tokenExists = await EmailVerification.findOne({ token });
        console.log('🎫 [VERIFY] Token exists in DB:', tokenExists ? 'YES' : 'NO');
        
        if (tokenExists) {
          console.log('⏰ [VERIFY] Token expires at:', tokenExists.expiresAt);
          console.log('✅ [VERIFY] Token verified status:', tokenExists.verified);
          console.log('⏰ [VERIFY] Current time:', new Date());
          console.log('⏰ [VERIFY] Is expired?', new Date() > tokenExists.expiresAt);
        }
      }
      
      if (!verification) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
      }
      
      // Kiểm tra xem email đã được đăng ký chưa
      const existingUser = await User.findOne({ email: verification.email });
      if (existingUser) {
        throw new Error('Email đã được đăng ký');
      }
      
      // Tạo user mới
      const newUser = new User({
        ...verification.userData,
        isVerified: true
      });
      
      // Gán permissions cho user mới
      const rolePermissionService = require('../services/rolePermissionService');
      // Tất cả user đều có quyền tạo bài
      rolePermissionService.assignDefaultUserPermissions(newUser);
      // Gán permissions theo role nếu có
      if (newUser.role && newUser.role !== 'user') {
          rolePermissionService.assignPermissionsByRole(newUser, newUser.role);
      }
      
      const user = await newUser.save();
      
      // Đánh dấu verification đã được sử dụng
      verification.verified = true;
      await verification.save();
      
      // Xóa verification record sau khi verify thành công
      await EmailVerification.deleteOne({ _id: verification._id });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user._doc;
      
      const result = { success: true, user: userWithoutPassword };
      
      // Lưu kết quả vào cache
      processedResults.set(token, result);
      
      return result;
    } finally {
      // Xóa token khỏi danh sách đang xử lý
      processingTokens.delete(token);
    }
  } catch (error) {
    console.error('Error verifying email token:', error);
    throw error;
  }
};

// Xóa các verification hết hạn và user chưa xác nhận
const cleanupExpiredVerifications = async () => {
  try {
    // Tìm các verification hết hạn
    const expiredVerifications = await EmailVerification.find({
      expiresAt: { $lt: new Date() },
      verified: false
    });
    
    // Xóa các verification hết hạn
    const result = await EmailVerification.deleteMany({
      expiresAt: { $lt: new Date() },
      verified: false
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired email verifications`);
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
    throw error;
  }
};

// Kiểm tra trạng thái verification
const checkVerificationStatus = async (email) => {
  try {
    const verification = await EmailVerification.findOne({ 
      email,
      verified: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!verification) {
      return { exists: false };
    }
    
    return { 
      exists: true, 
      expiresAt: verification.expiresAt,
      timeLeft: Math.max(0, verification.expiresAt - new Date())
    };
  } catch (error) {
    console.error('Error checking verification status:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  createVerificationToken,
  verifyEmailToken,
  cleanupExpiredVerifications,
  checkVerificationStatus
};
