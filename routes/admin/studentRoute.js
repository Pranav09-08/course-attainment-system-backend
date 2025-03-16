const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadStudents } = require('../../controllers/admin/studentController');

const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// Route to upload CSV file for adding students
router.post('/upload-students', upload.single('file'), uploadStudents);

module.exports = router;
