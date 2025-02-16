const express = require('express');
const router = express.Router();
const Controllers = require('../../controllers/coordinator/setTargetController');
const authenticateToken = require("../../middleware/authLoginMiddleware");

// Get courses assigned to a course coordinator
router.get('/course-coordinator/courses/:faculty_id', authenticateToken,Controllers.getCourses);

// Set course targets
router.post('/course-target/set-targets', authenticateToken,Controllers.setTargets);

module.exports = router;
