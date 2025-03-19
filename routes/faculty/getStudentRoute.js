const express = require("express");
const router = express.Router();
const { getStudents, getMarks } = require("../../controllers/faculty/getStudentController");

// Route to fetch students
router.post("/students", getStudents);

// Route to fetch marks
router.get("/marks", getMarks);

module.exports = router;