const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

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

const port = 8080;
dotenv.config();
const app = express();
app.use(cors());
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
app.use("/web-vnsim/auth", authRoute);
app.use("/web-vnsim/user", userRoute);
app.use("/web-vnsim/banner", bannerRoute);
app.use("/web-vnsim/product", productRoute);
app.use("/web-vnsim/blog", blogRoute);
app.use("/web-vnsim/order", orderRoute);
app.use("/web-vnsim/order-tracking", orderTrackingRoute);
app.use("/web-vnsim/payment", paymentRoute);
app.use("/web-vnsim/topic", topicRoute);
app.use("/web-vnsim/order-app", orderAppRoute);
app.use("/web-vnsim/shipping-company", shippingCompanyRoute);

//Chạy server tại  cổng (port)
app.listen(port, ()=>{
    console.log("Server is runningServer running on port",port);
})