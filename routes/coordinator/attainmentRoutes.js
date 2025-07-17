const express = require("express");
const router = express.Router();
const { getAttainmentData, getCoordinatorCourses,getFacultyInfo} = require("../../controllers/coordinator/attainmentController");
const authenticateToken = require("../../middleware/authLoginMiddleware");
const levelTargetController = require('../../controllers/coordinator/calculateAttainment');

// Route to get attainment data
router.get("/attainment-data", authenticateToken,getAttainmentData);

// Route to get courses assigned to a coordinator
router.get("/coordinator-courses", authenticateToken,getCoordinatorCourses);

router.get("/get-faculty",authenticateToken,getFacultyInfo);


// Route for updating level targets
router.post('/update-level-targets', authenticateToken,levelTargetController.updateLevelTargets);

module.exports = router;
