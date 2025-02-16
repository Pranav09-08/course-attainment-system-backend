const express = require("express");
const router = express.Router();
const { getAttainmentData, getCoordinatorCourses } = require("../../controllers/coordinator/attainmentController");
const authenticateToken = require("../../middleware/authLoginMiddleware");

// Route to get attainment data
router.get("/attainment-data", authenticateToken,getAttainmentData);

// Route to get courses assigned to a coordinator
router.get("/coordinator-courses", authenticateToken,getCoordinatorCourses);

module.exports = router;
