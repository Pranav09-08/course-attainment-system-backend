const express = require('express');
const router = express.Router();
const Controllers = require('../../controllers/coordinator/setTargetController');

// Get courses assigned to a course coordinator
router.get('/course-coordinator/courses/:faculty_id', Controllers.getCourses);

// Set course targets
router.post('/course-target/set-targets', Controllers.setTargets);

module.exports = router;
