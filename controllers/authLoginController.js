const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/loginModel");
const db = require("../db/db");
require("dotenv").config();

// Generate Access Token with user role
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let role = "";

    // 1️⃣ Check in Faculty
    user = await User.findUserByEmailFaculty(email);
    if (user) {
      role = "faculty";

      // 2️⃣ Check if faculty is also coordinator
      const coordinator = await User.findUserByFacultyId(user.faculty_id);
      if (coordinator) {
        role = "coordinator";
      }

    } else {
      // 3️⃣ Check in Department (admin)
      user = await User.findUserByDeptId(email);
      if (user) {
        role = "admin";
      }
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 🔐 Compare with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // ✅ Generate token and return user
    const accessToken = generateAccessToken(user.faculty_id || user.dept_id, role);
    res.json({ accessToken, user: { id: user.faculty_id || user.dept_id, role } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const sendOTP = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // 1️⃣ Check if faculty exists
    const faculty = await User.findUserByEmailFaculty(email);
  
    if (!faculty) return res.status(404).json({ message: "Email not registered" });

    // 2️⃣ Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // 3️⃣ Upsert OTP into password_resets table
    await db.query(`
      INSERT INTO password_resets (email, otp, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        otp = VALUES(otp),
        expires_at = VALUES(expires_at)
    `, [email, otp, expiresAt]);

    // 4️⃣ Send Email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Reset Password OTP</h2>
          <p>Hello <strong>${faculty.name || "Faculty"}</strong>,</p>
          <p>Your OTP for resetting your password is:</p>
          <h3 style="color: #007BFF;">${otp}</h3>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // ✅ 1. Find OTP entry
    const otpEntry = await User.findOTPEntry(email);
    if (!otpEntry) {
      return res.status(400).json({ message: "OTP not found. Please request again." });
    }

    // ✅ 2. Check if OTP is expired
    const now = new Date();
    if (now > otpEntry.expires_at) {
      await User.deleteOTPEntry(email);
      return res.status(400).json({ message: "OTP has expired. Request a new one." });
    }

    // ✅ 3. Check if OTP matches
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // ✅ 4. Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateFacultyPassword(email, hashedPassword);

    // ✅ 5. Delete used OTP
    await User.deleteOTPEntry(email);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login,sendOTP,resetPassword };
