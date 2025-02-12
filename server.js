const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require('./db/db'); // DB connection
const authLoginRoute = require("./routes/authLoginRoute"); // Login route
const facultyRoute = require('./routes/profileRoute');

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Define API routes
app.use("/auth", authLoginRoute);
app.use("/profile", facultyRoute);

// Example route for testing
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});


// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("✅ Database Connected Successfully");
});
