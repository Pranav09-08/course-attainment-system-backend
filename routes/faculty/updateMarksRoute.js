// routes/updateMarksRoute.js
const express = require("express");
const router = express.Router();
const { getMarks, updateMarks } = require("../../controllers/faculty/updateMarksController");

// Fetch marks for a specific student, course, department, and academic year
router.get("/marks/get_marks/:roll_no/:course_id/:dept_id/:academic_yr", getMarks);

// Update marks for a specific student, course, department, and academic year
router.post("/marks/update_marks/:roll_no/:course_id/:dept_id/:academic_yr", updateMarks);

module.exports = router;