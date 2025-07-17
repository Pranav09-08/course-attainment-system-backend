// routes/courseAttainment.js
const express = require('express');
const CourseAttainmentController = require('../../controllers/admin/attainmentAnalysis');
const authenticateToken = require("../../middleware/authLoginMiddleware");

const router = express.Router();

router.get('/:courseId', authenticateToken,CourseAttainmentController.getAttainment);

module.exports = router;