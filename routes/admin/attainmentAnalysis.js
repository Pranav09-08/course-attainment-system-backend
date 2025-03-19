// routes/courseAttainment.js
const express = require('express');
const CourseAttainmentController = require('../../controllers/admin/attainmentAnalysis');

const router = express.Router();

router.get('/:courseId', CourseAttainmentController.getAttainment);

module.exports = router;