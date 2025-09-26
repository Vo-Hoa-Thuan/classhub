const sgMail = require('@sendgrid/mail');
// Cấu hình SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Gửi email sử dụng SendGrid
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

// Gửi email đơn giản (text) sử dụng SendGrid
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

// Gửi email với template động
const sendTemplateEmail = async (to, templateId, dynamicTemplateData) => {
  try {
    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@classhub.com',
        name: 'ClassHub'
      },
      templateId: templateId,
      dynamicTemplateData: dynamicTemplateData
    };

    const result = await sgMail.send(msg);
    console.log('Template email sent successfully via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('Error sending template email via SendGrid:', error);
    throw error;
  }
};

// Gửi email hàng loạt
const sendBulkEmail = async (emails) => {
  try {
    const result = await sgMail.send(emails);
    console.log('Bulk emails sent successfully via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('Error sending bulk emails via SendGrid:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendSimpleEmail,
  sendTemplateEmail,
  sendBulkEmail
};