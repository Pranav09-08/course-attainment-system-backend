const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authLoginRoute = require("./routes/authLoginRoute");      // ✅ Login Route
const facultyRoute = require('./routes/profileRoute');          // ✅ Profile Route
const dashboardRoutes = require("./routes/dashboardAuth");    // ✅ Dashboard Route

const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ API Routes
app.use("/auth", authLoginRoute);         // Authentication Route (Login)
app.use("/profile", facultyRoute);        // Profile Route
app.use("/dashboard", dashboardRoutes);   // Protected Dashboard Routes (with roles)

// ✅ Example route for testing
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log("✅ Database Connected Successfully");
});
