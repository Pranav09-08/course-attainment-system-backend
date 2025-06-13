const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Profile data routes
router.get('/faculty/:id', profileController.getFaculty);
router.get('/admin/:id', profileController.getAdmin);
router.get('/coordinator/:id', profileController.getCoordinator);

// Keep the faculty by department route
router.get('/faculty/department/:deptId', profileController.getFacultyByDepartment);

module.exports = router;