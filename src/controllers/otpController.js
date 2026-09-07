const asyncHandler = require('express-async-handler');
const Otp = require('../models/Otp');
const { sendEmailOtp } = require('../utils/emailService');

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400);
    throw new Error('A valid email is required');
  }

  const normalized = email.toLowerCase().trim();
  const code = generateCode();

  await Otp.deleteMany({ email: normalized, verified: false });
  await Otp.create({ email: normalized, code });

  try {
    await sendEmailOtp(normalized, code);
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(502);
    throw new Error('Failed to send OTP email. Please try again.');
  }

  res.json({ success: true, message: 'OTP sent' });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    res.status(400);
    throw new Error('email and code are required');
  }

  const normalized = email.toLowerCase().trim();
  const otp = await Otp.findOne({ email: normalized, verified: false }).sort({ createdAt: -1 });

  if (!otp) {
    res.status(400);
    throw new Error('No OTP found. Please request a new one.');
  }
  if (otp.attempts >= 5) {
    res.status(400);
    throw new Error('Too many attempts. Please request a new OTP.');
  }
  if (otp.code !== code) {
    otp.attempts += 1;
    await otp.save();
    res.status(400);
    throw new Error('Incorrect OTP.');
  }

  otp.verified = true;
  await otp.save();

  res.json({ success: true, message: 'OTP verified' });
});

module.exports = { sendOtp, verifyOtp };
