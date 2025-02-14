const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/profileController');

// Route to get faculty by ID
router.get('/faculty/:id', facultyController.getFaculty);
router.get('/admin/:id',facultyController.getAdmin);
router.get('/coordinator/:id',facultyController.getCoordinator);

// Route to get all faculty by department ID
router.get('/faculty/department/:deptId', facultyController.getFacultyByDepartment);

module.exports = router;
