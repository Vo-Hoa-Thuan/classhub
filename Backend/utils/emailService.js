const sgMail = require('@sendgrid/mail');

// Cấu hình SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Gửi email
const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com',
        name: 'ClassHub'
      },
      subject: subject,
      html: html
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw error;
  }
};

// Gửi email đơn giản (text)
const sendSimpleEmail = async (to, subject, text) => {
  try {
    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com',
        name: 'ClassHub'
      },
      subject: subject,
      text: text
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendSimpleEmail
};