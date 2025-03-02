require('dotenv').config(); // Load environment variables first
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Existing routes
const courseRoute = require('./routes/faculty/coursesRoute');
const facultRoute2 = require('./routes/faculty/courseAllotmentRoute');
const authLoginRoute = require("./routes/authLoginRoute");
const facultyRoute = require('./routes/profileRoute');
const dashboardRoutes = require("./routes/dashboardAuth");
const adminRoutes = require('./routes/admin/adminRoute');
const attainmentRoutes = require('./routes/coordinator/attainmentRoutes');
const setTarget = require('./routes/coordinator/setTargetRoute');
const marksRoutes = require('./routes/faculty/courseAllotmentRoute');
const adminCourseRoute = require('./routes/admin/courseRoute');
const courseReportRoutes = require('./routes/coordinator/courseReportRouter');

const addmarks =require('./routes/faculty/marksRoute');
const courseAllotmentRoutes = require("./routes/admin/courseAllotmentRoute");


// New contact route
const contactRoute = require("./routes/contactRoute");

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Define API routes
app.use("/courses", courseRoute);
app.use("/faculty_courses", facultRoute2);
app.use("/attainment", attainmentRoutes);
app.use("/report",courseReportRoutes);
app.use("/set_target", setTarget);
app.use("/auth", authLoginRoute);
app.use("/profile", facultyRoute);
app.use("/dashboard", dashboardRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/course", adminCourseRoute);
app.use("/admin/allotment", courseAllotmentRoutes);

// New contact route
app.use("/contact", contactRoute);
app.use('/marks', marksRoutes);
app.use('/add_marks',addmarks);
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
