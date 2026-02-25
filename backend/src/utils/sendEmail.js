import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";    
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS, not SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Ledgerly" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    console.log("Password reset OTP email sent successfully");
  } catch (error) {
    console.error("Password reset email sending failed:", error);
    throw new Error("Email failed");
  }
};

const sendVerificationEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Ledgerly" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Ledgerly account",
      html: `
        <h2>Welcome to Ledgerly</h2>
        <p>Please verify your email using the code below:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Verification email sending failed:", error);
    throw new Error("Email failed");
  }
};

export { sendResetEmail, sendVerificationEmail };
