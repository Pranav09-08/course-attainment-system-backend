const express = require('express');
const router = express.Router();
const facultyController = require('../../controllers/faculty/courseAllotmentController');
const authenticateToken = require("../../middleware/authLoginMiddleware");

// Route to get faculty by ID (Protected with authentication)
router.get('/faculty_course_allot/:id',  facultyController.getFaculty);

//Route to get faculty by ID whose attainment is not calculated
router.get('/faculty_addmarks/:id',  facultyController.getFacultyWithNullAttainment);
router.get("/faculties-for-course", facultyController.getFacultiesForCourse);

module.exports = router;
