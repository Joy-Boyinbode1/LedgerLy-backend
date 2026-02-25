import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import auth from '../middleware/auth.js';
import { sendResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import dotenv from 'dotenv';

dotenv.config();


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Log the login attempt (safe: don't log password)
    console.log('POST /auth/login', { email });

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }


    // 2️⃣ Find user in database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || process.env.JWT_EXPIRES_IN }
    );

    // 5️⃣ Send response: include a `firstTime` flag if useful for frontend routing
    const firstTime = user.emailVerified === false;

    res.status(200).json({
      message: 'Login successful',
      token,
      firstTime
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};



const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      });
    }


    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
      //res.redirect("/login")
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // if user does not exist Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      emailVerified: false
    });

    // Generate verification OTP and send to email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    newUser.otp = hashedOtp;
    newUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    newUser.otpAttempts = 0;
    await newUser.save();

    // send verification email
    try {
      await sendVerificationEmail(email, otp);
    } catch (err) {
      console.error('Failed to send verification email:', err);
      // continue; user is created but email may fail
    }

    res.status(201).json({
      message: 'User registered successfully. OTP sent to email for verification.',
      userId: newUser.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ===================forgot password===================//


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, an OTP has been sent."
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 HASH the OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.otpAttempts = 0;

    await user.save();

    // TODO: Send OTP via email
    //console.log("OTP:", otp);
    // 📧 Send password-reset OTP email
    try {
      await sendResetEmail(email, otp);
    } catch (err) {
      console.error('Failed to send reset OTP email:', err);
    }

    return res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

//=====================Resend OTP=======================//
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, an OTP has been sent."
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Try again later."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 HASH the OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    console.log("Resent OTP:", otp);

    // Send appropriate email depending on whether user has verified their email
    try {
      if (user.emailVerified) {
        await sendResetEmail(email, otp);
      } else {
        await sendVerificationEmail(email, otp);
      }
    } catch (err) {
      console.error('Failed to send OTP email on resend:', err);
      // don't fail the response to avoid leaking existence
    }

    res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error('resendOtp error:', error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};


//=====================validate OTP======================//
const validateOtp = async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many failed attempts. Try again later."
      });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }
    const isMatch = await bcrypt.compare(enteredOtp, user.otp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP correct → clear OTP
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    await user.save();

    res.status(200).json({
      message: "OTP verified. You can now reset your password."
    });

  } catch (error) {
    console.error('validateOtp error:', error);
    res.status(500).json({ message: "OTP validation failed" });
  }
};

//=====================verify email OTP (for registration)======================//
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({ message: "Too many failed attempts. Try again later." });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(enteredOtp, user.otp);
    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP correct → mark email verified and clear OTP
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.emailVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error('verifyEmailOtp error:', error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

//=======================Reset password============================//
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: "Password reset failed" });
  }
};


export { login, register, forgotPassword, resetPassword, resendOtp, validateOtp, verifyEmailOtp };




