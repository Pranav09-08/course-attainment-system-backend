const express = require("express");
const { getCourses } = require("../../controllers/faculty/courseController");


const router = express.Router();

router.get("/courses", getCourses);

module.exports = router;
