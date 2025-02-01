const jwt = require("jsonwebtoken");
const User = require("../models/loginModel");
require("dotenv").config();

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    // Directly compare plain text passwords
    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate access token
    const accessToken = generateAccessToken(user.id);

    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
