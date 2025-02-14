// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authLoginMiddleware");
const authorizeRoles = require("../middleware/roleAuth");

// Faculty Route
router.get("/faculty-dashboard", authenticateToken, authorizeRoles("faculty", "coordinator", "admin"), (req, res) => {
  res.json({ msg: "Welcome Faculty!" });
});

// Coordinator Route
router.get("/coordinator-dashboard", authenticateToken, authorizeRoles("coordinator", "admin"), (req, res) => {
  res.json({ msg: "Welcome Coordinator!" });
});

// Admin Route
router.get("/admin-dashboard", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ msg: "Welcome Admin!" });
});

module.exports = router;
