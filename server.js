require('dotenv').config(); // Load environment variables first
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');


// Faculty Imports for Routes
const courseRoute = require('./routes/faculty/coursesRoute');
const facultRoute2 = require('./routes/faculty/courseAllotmentRoute');
const marksRoutes = require('./routes/faculty/courseAllotmentRoute');
const addmarks =require('./routes/faculty/marksRoute');
const getStudentRoute =require('./routes/faculty/getStudentRoute');
const updateMarksRoute = require('./routes/faculty/updateMarksRoute');


// Common Imports for Routes
const authLoginRoute = require("./routes/authLoginRoute");
const facultyRoute = require('./routes/profileRoute');
const updateProRoute = require('./routes/updateProfileRoute');
const dashboardRoutes = require("./routes/dashboardAuth");
const contactRoute = require("./routes/contactRoute");


// Admin Imports for Routes
const adminRoutes = require('./routes/admin/adminRoute');
const adminCourseRoute = require('./routes/admin/courseRoute');
const adminCourseCoordinatorRoute = require('./routes/admin/courseCoordinatorRoute');
const courseAllotmentRoutes = require("./routes/admin/courseAllotmentRoute");
const studentRoute = require('./routes/admin/studentRoute');
const courseAttainmentRoutes = require('./routes/admin/attainmentAnalysis');

// Coordinator Imports for Routes
const attainmentRoutes = require('./routes/coordinator/attainmentRoutes');
const setTarget = require('./routes/coordinator/setTargetRoute');
const courseReportRoutes = require('./routes/coordinator/courseReportRouter');



const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//Faculty Routes
app.use("/courses", courseRoute);
app.use("/faculty_courses", facultRoute2);
app.use('/marks', marksRoutes);
app.use('/add_marks',addmarks);
app.use("/get_student",getStudentRoute);
app.use("/update", updateMarksRoute);



//Common Routes
app.use("/auth", authLoginRoute);
app.use("/profile", facultyRoute);
app.use("/dashboard", dashboardRoutes);
app.use('/api/profile', updateProRoute);
app.use('/upload_image', express.static(path.join(__dirname, 'upload_image')));
app.use("/contact", contactRoute);


//Coordinator Routes
app.use("/attainment", attainmentRoutes);
app.use("/report",courseReportRoutes);
app.use("/set_target", setTarget);


//Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin/course", adminCourseRoute);
app.use("/admin/allotment", courseAllotmentRoutes);
app.use("/admin/coordinator",adminCourseCoordinatorRoute);
app.use("/admin/student",studentRoute);
app.use('/admin/course-attainment-analysis',courseAttainmentRoutes);



// Example route for testing
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log("✅ Database Connected Successfully");
});
