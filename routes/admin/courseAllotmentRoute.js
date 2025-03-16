const express = require("express");
const router = express.Router();

const authenticateToken = require("../../middleware/authLoginMiddleware");
const allotcoursecontroller = require("../../controllers/admin/courseAllotmentController");


// Route to allot a new course
router.post('/add-course-allotment',authenticateToken, allotcoursecontroller.allotCourse);  
router.get("/get-allotted-courses", authenticateToken, allotcoursecontroller.getAllottedCourses);
router.put("/update-course-allotment/:courseId/:academicYr/:sem",authenticateToken, allotcoursecontroller.updateCourseAllotmentFaculty);
router.delete("/delete-course-allotment/:courseId/:academicYr/:sem", authenticateToken, allotcoursecontroller.deleteCourseAllotment);


module.exports = router;
