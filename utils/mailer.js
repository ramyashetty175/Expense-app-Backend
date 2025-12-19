const nodemailer = require('nodemailer');
//const { MailtrapTransport } = require("mailtrap");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (toEmail, username) => {
  const mailOptions = {
    from: "no-reply@mailtrap.io",
    to: toEmail,
    subject: "Welcome to Our App!",
    text: `Hi ${username},\n\nThanks for registering with us!\n\nWe're glad to have you on board.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent");
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
};

module.exports = sendWelcomeEmail;
