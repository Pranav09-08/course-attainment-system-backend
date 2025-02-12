const express = require('express');
const loginController = require("../controllers/login_Controller");

const router = express.Router();

router.post("/login",loginController.login);

module.exports= router;