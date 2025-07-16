const express = require('express');
const router = express.Router();
const courseReportController = require('../../controllers/coordinator/coursereportController');
const authenticateToken = require("../../middleware/authLoginMiddleware");

// Route for generating and downloading the report
router.get('/download-report', authenticateToken,courseReportController.downladReport);
router.get('/generate-report', authenticateToken,courseReportController.generateReport);
router.get('/show-marktarget', authenticateToken,courseReportController.getmarksTarget);

module.exports = router;
