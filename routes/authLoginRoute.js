const express = require("express");
const { login } = require("../controllers/authLoginController");
const { validateLogin } = require("../validators/authLoginValidator");

const router = express.Router();

router.post("/login", validateLogin, login);

module.exports = router;
