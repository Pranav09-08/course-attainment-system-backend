<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require('./db/db'); // DB connection
const authLoginRoute = require("./routes/authLoginRoute"); // Login route
const facultyRoute = require('./routes/profileRoute');
=======
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authLogin = require("./routes/loginRoutes")
>>>>>>> 04a80527ae94fa921db908c65b12002cfdebd35c

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();
<<<<<<< HEAD
=======
app.use(express.json());
app.use('/auth', authLogin);

const db = require('./db/db'); // Import the db.js file

(async () => {
  try {
    // Attempt to get a connection from the pool
    const connection = await db.getConnection();
    console.log('Database is connected successfully!');
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
})();

>>>>>>> 04a80527ae94fa921db908c65b12002cfdebd35c

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
