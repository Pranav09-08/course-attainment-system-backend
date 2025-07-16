const express = require('express');
const router = express.Router();
const { 
  uploadStudents, 
  getStudents, 
  updateStudentController, 
  deleteStudentController 
} = require('../../controllers/admin/studentController');
const multer = require('multer');
const authenticateToken = require("../../middleware/authLoginMiddleware");
const upload = multer({ storage: multer.memoryStorage() });

// Upload students (now expects sem and academic_yr in body)
router.post('/upload-students', authenticateToken,upload.single('file'), uploadStudents);

// Get students (now requires sem and academic_yr as query params)
router.get('/get-students', authenticateToken,getStudents);

// Update student (now requires sem and academic_yr in body)
router.put('/update-student/:roll_no', authenticateToken, updateStudentController);

// Delete student (now requires sem and academic_yr as query params)
router.delete('/delete-student/:roll_no', authenticateToken,deleteStudentController);

module.exports = router;