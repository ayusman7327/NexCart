require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.myMail,
    pass: process.env.appPassword,
  },
});

const sendOtp = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"NexCart" <${process.env.myMail}>`,
      to: toEmail,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
          
          <h2 style="color: #4A90E2;">Password Reset OTP</h2>

          <p>You requested to reset your password.</p>

          <p>Your One-Time Password (OTP) is:</p>

          <div style="
              font-size: 24px;
              font-weight: bold;
              background: #f4f4f4;
              padding: 15px;
              text-align: center;
              letter-spacing: 5px;
              border-radius: 8px;
              margin: 20px 0;">
            ${otp}
          </div>

          <p>This OTP is valid for <strong>5 minutes</strong>.</p>

          <p>If you did not request this, please ignore this email.</p>

          <hr style="margin: 30px 0;" />

          <p style="font-size: 12px; color: #777;">
            This is an automated email from NexCart. Please do not reply.
          </p>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.log("Email error:", error);
  }
};

module.exports = { sendOtp };
