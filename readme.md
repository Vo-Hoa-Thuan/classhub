
# ClassHub

Website e‑Commerce bán phần mềm số & dụng cụ hỗ trợ dạy học.

## Mô tả dự án

ClassHub là nền tảng thương mại điện tử chuyên về sản phẩm giáo dục số, hướng tới người dùng như học sinh, sinh viên và giáo viên.  
Gồm 2 phần chính:

- **Frontend**: giao diện người dùng, quản lý trải nghiệm người dùng  
- **Backend**: API, xử lý logic, quản lý dữ liệu  

## Tính năng chính

- Đăng ký / Đăng nhập, phân quyền (User, Blogger_Admin, Product Manager, Admin)  
- Quản lý sản phẩm, giỏ hàng, đặt hàng, thanh toán  
- Blog & banner quảng bá  
- Dashboard quản trị hệ thống (quản lý người dùng, sản phẩm, doanh thu, đơn hàng, v.v.)  
- Bảo mật: hash mật khẩu, JWT, bảo vệ các route nhạy cảm  

## Kiến trúc & công nghệ

- Frontend: ReactJS, Redux Toolkit, Ant Design  
- Backend: NodeJS + Express  
- Database: MongoDB Atlas  
- Triển khai: Frontend → Vercel, Backend → Render  
- Authentication & Security: JWT (Access / Refresh), Helmet, rate limiting  

## Yêu cầu môi trường

- Node.js >= 14.x  
- npm hoặc yarn  
- MongoDB (Atlas hoặc instance riêng)  
- Các biến môi trường (ENV) thiết yếu, ví dụ:

```
# cd Backend, (Tạo file .env)
MONGODB_URL = mongodb+srv://ClassHub:thangle1710@tmdt.objzpaa.mongodb.net/?retryWrites=true&w=majority&appName=TMDT
MY_ACCESS_KEY= THANSGDAIWODOANUFWUHAWEFHAIOWEFHOIAHWFIOHAWDFAWDF
MY_REFRESH_KEY= AWFJHAGWDFGAYUIWBDFAUIWBFUIAWHDIUHAWUIDHAWDAWD
VNP_TMNCODE= F48SLXXB
VNP_HashSecret= NBCAXHSVJWMOLULOTYEJEVAYXNZGIPFA
VNP_URL= https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_ReturnUrl= http://localhost:3000/cart
MY_ID_KEY=AWUDHAWUIHDUIAWHDUIAHWDUIHAFUIABNEWUFIHAEF
EMAIL_PASS=ockk qaho omcs hogw
EMAIL_USER=lephuocthang207@gmail.com
FRONTEND_URL=http://localhost:3000
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=lephuocthang207@gmail.com
```

```

## Hướng dẫn cài đặt & chạy

### Backend

```bash
cd Backend
npm install              # hoặc yarn
# tạo file .env theo mẫu
npm run start             # chạy ở môi trường sản xuất
```

### Frontend

```bash
cd Frontend
npm install              # hoặc yarn
# tạo file .env theo mẫu
npm start                 # chạy ứng dụng React (dev)
```

## Kiểm thử / gỡ lỗi

- Kiểm tra console logs (frontend & backend)  
- Sử dụng Postman / Insomnia để gọi API (ví dụ đăng nhập, lấy danh sách sản phẩm)  
- Kiểm tra authentication, phân quyền (các route mà user không được phép truy cập)  

## Triển khai (Deployment)

- Frontend deploy trên Vercel  
- Backend deploy trên Render  
- Cấu hình biến môi trường cho môi trường sản xuất  
- (Tùy chọn) sử dụng CI/CD để tự động deploy khi push code  

## Cấu trúc thư mục đề xuất

```
/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.js
│   └── public/
└── README.md
```

## Biến môi trường & cấu hình quan trọng

- **MONGODB_URI**: kết nối database  
- **JWT_SECRET / JWT_REFRESH_SECRET**: khóa mã hóa token  
- **SENDGRID_API_KEY**: để gửi email (nếu có)  
- **FRONTEND_URL**: URL front-end cho redirect, CORS  

## Những phần nên cải tiến / hướng phát triển

- Hệ thống microservices (chia nhỏ backend)  
- Tích hợp nhiều cổng thanh toán  
- Tính năng gợi ý sản phẩm (AI / ML)  
- Tối ưu hiệu năng, cache (Redis, CDN)  
- Tăng cường bảo mật (cập nhật các best practice)  

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng:

1. Fork mã nguồn  
2. Tạo branch tính năng mới  
3. Commit & push  
4. Gửi Pull Request  

## Liên hệ

Nếu có vấn đề, bạn có thể liên hệ qua email: **[điền email của bạn]**  
Hoặc mở issue trên GitHub để trao đổi.
