const express = require("express");
const router = express.Router();
const { getAttainmentData, getCoordinatorCourses } = require("../controllers/attainmentController");

// Route to get attainment data
router.get("/attainment-data", getAttainmentData);

// Route to get courses assigned to a coordinator
router.get("/coordinator-courses", getCoordinatorCourses);

module.exports = router;
