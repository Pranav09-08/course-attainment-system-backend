const express = require("express");
const router = express.Router();
const { getStudents } = require("../../controllers/faculty/getStudentController");

// Define the route
router.post("/students", getStudents);

module.exports = router;

