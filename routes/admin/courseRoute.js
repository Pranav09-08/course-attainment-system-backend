const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');
const authenticateToken = require("../../middleware/authLoginMiddleware");

// Route to add a new course
router.post('/add-course', authenticateToken, courseController.addCourse);

module.exports = router;
