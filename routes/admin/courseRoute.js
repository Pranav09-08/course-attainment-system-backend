const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');
const authenticateToken = require("../../middleware/authLoginMiddleware");

router.post('/add-course', authenticateToken, courseController.addCourse);
router.get('/get-courses', authenticateToken, courseController.getCourses);
router.delete('/delete-course/:course_id', authenticateToken, courseController.deleteCourse);
router.put('/update-course/:course_id', authenticateToken, courseController.updateCourse);

module.exports = router;
