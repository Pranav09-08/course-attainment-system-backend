const express = require("express");
const { login,sendOTP,resetPassword } = require("../controllers/authLoginController");
const { validateLogin } = require("../validators/authLoginValidator");

const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/send-otp",sendOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
