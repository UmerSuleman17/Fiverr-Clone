const nodemailer = require('nodemailer');
const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE } = require('../config');
const logger = require('../utils/logger');

let transporter;

const initTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_SMTP_HOST,
      port: EMAIL_SMTP_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = initTransporter();
    
    const mailOptions = {
      from: `"Fiverr Clone" <${EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

// Email templates
const orderConfirmationEmail = (buyer, seller, gig, order) => {
  return `
    <h1>Order Confirmation</h1>
    <p>Dear ${buyer.name},</p>
    <p>Your order for "${gig.title}" has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Amount:</strong> $${gig.price}</p>
    <p><strong>Seller:</strong> ${seller.name}</p>
    <p>The seller has been notified and will start working on your project.</p>
    <br>
    <p>Thank you for using Fiverr Clone!</p>
  `;
};

const orderDeliveredEmail = (buyer, seller, gig, order) => {
  return `
    <h1>Order Delivered</h1>
    <p>Dear ${buyer.name},</p>
    <p>The seller ${seller.name} has delivered your order for "${gig.title}".</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p>Please review the work and mark the order as complete if satisfied.</p>
    <br>
    <p>Thank you for using Fiverr Clone!</p>
  `;
};

const welcomeEmail = (user) => {
  return `
    <h1>Welcome to Fiverr Clone!</h1>
    <p>Dear ${user.name},</p>
    <p>Thank you for joining Fiverr Clone, the marketplace for freelance services.</p>
    <p>You are registered as a <strong>${user.role}</strong>.</p>
    ${user.role === 'seller' ? '<p>Start creating your gigs and attract buyers!</p>' : '<p>Start exploring gigs and find the perfect service!</p>'}
    <br>
    <p>Best regards,<br>The Fiverr Clone Team</p>
  `;
};

module.exports = {
  sendEmail,
  orderConfirmationEmail,
  orderDeliveredEmail,
  welcomeEmail,
};