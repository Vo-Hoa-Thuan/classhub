# Hướng dẫn cấu hình chức năng Quên mật khẩu

## 📁 Cấu trúc file đã tạo

### Frontend (components/pages):
```
Frontend/src/components/pages/
├── forgot-password/
│   ├── ForgotPassword.js
│   └── ForgotPassword.css
└── reset-password/
    ├── ResetPassword.js
    └── ResetPassword.css
```

### Backend:
```
Backend/
├── controllers/
│   └── mailController.js
├── models/
│   └── ResetToken.js
└── routes/
    └── auth.js (đã cập nhật)
```

## 🚀 Cài đặt và cấu hình

### 1. Cài đặt nodemailer
```bash
cd Backend
npm install nodemailer
```

### 2. Cấu hình Environment Variables
Tạo file `.env` trong thư mục `Backend`:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/classhub

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=8080
```

### 3. Cấu hình Gmail App Password

#### Bước 1: Bật 2-Factor Authentication
1. Đăng nhập vào Gmail
2. Vào Settings > Security
3. Bật "2-Step Verification"

#### Bước 2: Tạo App Password
1. Vào Google Account Settings
2. Security > 2-Step Verification
3. Cuộn xuống "App passwords"
4. Chọn "Mail" và "Other (Custom name)"
5. Nhập tên: "ClassHub"
6. Copy password được tạo (16 ký tự)

## 🔧 API Endpoints

### 1. Gửi reset token
```
POST /classhub/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. Xác thực token
```
GET /classhub/auth/verify-reset-token/:token
```

### 3. Đặt lại mật khẩu
```
POST /classhub/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "new_password_here"
}
```

## 🎨 Tính năng UI/UX

### ForgotPassword Page:
- ✅ Form nhập email với validation
- ✅ Loading state khi gửi request
- ✅ Toast notifications cho feedback
- ✅ Responsive design
- ✅ Link quay lại đăng nhập

### ResetPassword Page:
- ✅ Form nhập mật khẩu mới và xác nhận
- ✅ Validation mật khẩu (tối thiểu 6 ký tự)
- ✅ Loading state khi cập nhật
- ✅ Xác thực token trước khi hiển thị form
- ✅ Error handling cho token không hợp lệ

## 🔒 Tính năng bảo mật

### Backend Security:
- ✅ Token có hạn 15 phút
- ✅ Token chỉ sử dụng được 1 lần
- ✅ Tự động xóa token sau khi sử dụng
- ✅ Tự động xóa token hết hạn
- ✅ Xóa token cũ khi tạo token mới
- ✅ Validation đầy đủ cho tất cả inputs

### Database Security:
- ✅ Index tối ưu cho performance
- ✅ TTL index cho auto-cleanup
- ✅ Unique constraint cho token
- ✅ Middleware tự động cleanup

## 📧 Email Template

Email được gửi với:
- ✅ HTML template đẹp mắt
- ✅ Responsive design
- ✅ Thông tin bảo mật rõ ràng
- ✅ Cảnh báo về thời gian hết hạn
- ✅ Hướng dẫn sử dụng

## 🧪 Test chức năng

### 1. Khởi động Backend:
```bash
cd Backend
npm start
```

### 2. Khởi động Frontend:
```bash
cd Frontend
npm start
```

### 3. Test flow:
1. Truy cập: `http://localhost:3000/forgot-password`
2. Nhập email hợp lệ
3. Kiểm tra email nhận được
4. Click link trong email
5. Đặt lại mật khẩu mới
6. Đăng nhập với mật khẩu mới

## 🐛 Troubleshooting

### Lỗi "Invalid login":
- Kiểm tra EMAIL_USER và EMAIL_PASS trong .env
- Đảm bảo đã bật 2FA và tạo App Password

### Lỗi "Connection timeout":
- Kiểm tra kết nối internet
- Kiểm tra firewall/antivirus

### Token không hoạt động:
- Kiểm tra FRONTEND_URL trong .env
- Đảm bảo token chưa hết hạn
- Kiểm tra token chưa được sử dụng

### Email không được gửi:
- Kiểm tra cấu hình Gmail App Password
- Kiểm tra spam folder
- Kiểm tra logs trong console

## 📝 Lưu ý quan trọng

1. **Environment Variables**: Đảm bảo tất cả biến môi trường được cấu hình đúng
2. **Gmail Security**: Sử dụng App Password, không dùng mật khẩu thường
3. **Token Expiry**: Token chỉ có hiệu lực 15 phút
4. **One-time Use**: Mỗi token chỉ sử dụng được 1 lần
5. **Auto Cleanup**: Token hết hạn sẽ tự động bị xóa
6. **Security**: Không log token trong console logs
