const jwt = require("jsonwebtoken");
const User = require("../models/loginModel");
require("dotenv").config();

// Generate Access Token with user role
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in Faculty table
    let user = await User.findUserByEmailFaculty(email);
    let role = 'faculty';

    if (!user) {
      // If user is not found in Faculty table, check Course Coordinator table
      user = await User.findUserByEmailCoordinator(email);
      role = 'coordinator';

      if (!user) {
        // If user is not found in Course Coordinator table, check Department table (admin)
        user = await User.findUserByEmailDepartment(email);
        role = 'admin';
      }
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Directly compare plain text passwords
    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate access token with role
    const accessToken = generateAccessToken(user.id, role);

    // Return user details with access token
    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, role } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };
