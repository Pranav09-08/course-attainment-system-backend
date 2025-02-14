const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require("../middleware/authLoginMiddleware");

// Route to add a new faculty member
router.post('/add-faculty', adminController.addFaculty);                         //add faculty
router.put('/update-faculty/:faculty_id', adminController.updateFaculty);        //update faculty
router.delete('/delete-faculty/:faculty_id', adminController.deleteFaculty);     //delete faculty
router.get("/get-coordinators", authenticateToken, adminController.getCoordinatorsByDepartment);

module.exports = router;
