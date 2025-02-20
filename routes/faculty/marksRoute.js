const express = require("express");
const router = express.Router();
const marksController = require("../../controllers/faculty/marksController");
const multer = require("multer");

// Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Route for uploading marks via CSV
router.post("/upload_marks", upload.single("file"), marksController.uploadMarks);

module.exports = router;
