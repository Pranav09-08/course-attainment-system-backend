const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/loginModel");
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

module.exports = { login };
