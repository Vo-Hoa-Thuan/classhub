const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//Khai báo route
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const bannerRoute = require("./routes/banner")
const productRoute = require("./routes/product")
const blogRoute = require("./routes/blog")
const orderRoute = require("./routes/order")
const orderTrackingRoute = require("./routes/ordertracking")
const paymentRoute = require("./routes/payment")
const topicRoute = require("./routes/topic")
const orderAppRoute = require("./routes/orderapp")
const shippingCompanyRoute = require("./routes/shippingcompany")
const roleRoute = require("./routes/role")

// Import validation middleware
const { validateRegister, validateLogin, validateUpdateUser } = require("./middleware/validation");

// Import error handling middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

const port = 8080;
dotenv.config();
const app = express();

// Cấu hình rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP 100 requests trong 15 phút
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true, // Trả về rate limit info trong headers
  legacyHeaders: false, // Tắt X-RateLimit-* headers
});

// Rate limiting cho auth routes (nghiêm ngặt hơn)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Chỉ 5 lần đăng nhập/đăng ký trong 15 phút
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes"
  },
  skipSuccessfulRequests: true, // Không tính các request thành công
});

// Áp dụng rate limiting - TẠM THỜI TẮT ĐỂ TEST
// app.use(limiter);

// Thêm helmet.js để bảo vệ security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false // Tắt để tránh xung đột với CORS
}));

// Cấu hình CORS an toàn
app.use(cors({
  origin: [
    'http://localhost:3000',  // Frontend development
    'http://localhost:3001',  // Frontend alternative port
    'https://yourdomain.com'  // Production domain (thay đổi theo domain thực tế)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-requested-with'],
  optionsSuccessStatus: 200
}));
app.use(cookieParser())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });

//ROUTES
app.use("/classhub/auth", authRoute);
app.use("/classhub/user", userRoute);
app.use("/classhub/banner", bannerRoute);
app.use("/classhub/product", productRoute);
app.use("/classhub/blog", blogRoute);
app.use("/classhub/order", orderRoute);
app.use("/classhub/order-tracking", orderTrackingRoute);
app.use("/classhub/payment", paymentRoute);
app.use("/classhub/topic", topicRoute);
app.use("/classhub/order-app", orderAppRoute);
app.use("/classhub/shipping-company", shippingCompanyRoute);
app.use("/classhub/role", roleRoute);

// 404 handler for undefined routes
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

//Chạy server tại  cổng (port)
app.listen(port, ()=>{
    console.log("Server is running on port",port);
})