const express = require('express');
const teacherController = require("../controllers/teacherController");

const router = express.Router();

router.post('/create-table',teacherController.createTable);
router.post('/add-teacher',teacherController.addTeacher);
router.get('/get-teacher',teacherController.getTeacher);

module.exports = router;