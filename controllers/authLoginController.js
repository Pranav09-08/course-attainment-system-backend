const jwt = require("jsonwebtoken");
const User = require("../models/loginModel");
require("dotenv").config();

// Generate Access Token with user role
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Accepts email

    let user = null;
    let role = "";

    // Case 1: Check if the user exists in Faculty Table (role = faculty)
    user = await User.findqUserByEmailFaculty(email);
    if (user) {
      role = "faculty";

      // Case 2: Check if the user is also a Coordinator (role = coordinator)
      const coordinator = await User.findUserByFacultyId(user.faculty_id);
      if (coordinator) {
        role = "coordinator"; // Upgrade role if user is also a coordinator
      }

    } else {
      // Case 3: Check if the user exists in Admin Table (role = admin)
      user = await User.findUserByDeptId(email); // Admin login is now identified by email
      if (user && password === user.password) {
        role = "admin";
      }
    }

    // If no user found or password mismatch
    if (!user || password !== user.password) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate access token with user ID and role
    const accessToken = generateAccessToken(user.faculty_id || user.dept_id, role);

    // Return user details with access token
    res.json({ accessToken, user: { id: user.faculty_id || user.dept_id, role } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login };
