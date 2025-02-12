const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/profileController');

// Route to get faculty by ID
router.get('/faculty/:id', facultyController.getFaculty);
router.get('/admin/:id',facultyController.getAdmin);
router.get('/coordinator/:id',facultyController.getCoordinator);

module.exports = router;
