import express from 'express';
import { login, register, forgotPassword, resendOtp, validateOtp, resetPassword, verifyEmailOtp } from '../controllers/auth.controller.js';

const authrouter = express.Router();


authrouter.post("/login",login);
authrouter.post("/register", register)
authrouter.post("/forgot-password", forgotPassword);
authrouter.post("/resend-otp", resendOtp);
authrouter.post("/validate-otp", validateOtp);
authrouter.post("/reset-password", resetPassword);
authrouter.post('/verify-email-otp', verifyEmailOtp);


export default authrouter