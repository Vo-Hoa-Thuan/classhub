const nodemailer = require('nodemailer');

// Cấu hình email transporter
const createTransporter = () => {
  // Sử dụng Gmail SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASS  // App password của Gmail
    }
  });
};

// Gửi email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ClassHub" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Gửi email đơn giản (text)
const sendSimpleEmail = async (to, subject, text) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"ClassHub" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendSimpleEmail
};
