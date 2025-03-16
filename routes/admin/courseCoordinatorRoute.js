const express = require("express");
const router = express.Router();
const courseCoordinatorController = require("../../controllers/admin/courseCoordinatorController");
const authenticateToken = require("../../middleware/authLoginMiddleware");

// 🔹 API to allot a course coordinator
router.post("/add-course-coordinator", authenticateToken, courseCoordinatorController.allotCourseCoordinatorHandler);
router.get("/get-course-coordinators/:dept_id", authenticateToken, courseCoordinatorController.getCourseCoordinatorsByDeptHandler);
router.put("/update-course-coordinator/:courseId/:academicYr/:sem", authenticateToken, courseCoordinatorController.updateCourseCoordinatorFacultyHandler);
router.delete("/delete-course-coordinator/:courseId/:academicYr/:sem", authenticateToken, courseCoordinatorController.deleteCourseCoordinatorHandler);

module.exports = router;
