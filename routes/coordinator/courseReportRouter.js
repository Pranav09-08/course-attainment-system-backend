const express = require('express');
const router = express.Router();
const courseReportController = require('../../controllers/coordinator/coursereportController');

// Route for generating and downloading the report
router.get('/download-report', courseReportController.downladReport);
router.get('/generate-report', courseReportController.generateReport);
router.get('/show-marktarget', courseReportController.getmarksTarget);

module.exports = router;
