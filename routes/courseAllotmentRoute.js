const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/courseAllotmentController');

// Route to get faculty by ID
router.get('/faculty_course_allot/:id', facultyController.getFaculty);
module.exports = router;