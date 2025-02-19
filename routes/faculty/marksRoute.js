const express = require('express');
const router = express.Router();
const multer = require('multer');
const marksController = require('../../controllers/faculty/marksController');
const authenticateToken = require("../../middleware/authLoginMiddleware");
// Multer storage for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API route for mark upload (protected)
router.post('/upload-marks', authenticateToken, upload.single('file'), marksController.uploadMarks);

module.exports = router;
