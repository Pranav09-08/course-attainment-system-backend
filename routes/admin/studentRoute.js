const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadStudents, getStudents,updateStudentController } = require('../../controllers/admin/studentController');
const { updateStudent } = require('../../models/admin/studentModel');

const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Route to upload CSV file for adding students
router.post('/upload-students', upload.single('file'), uploadStudents);
router.get('/get-students',getStudents);
router.put('/update-student/:roll_no', updateStudentController);


module.exports = router;
