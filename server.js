// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

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


// Middleware setup
app.use(bodyParser.json()); // Parse JSON requests
app.use(cors());            // Enable CORS for cross-origin requests

// Example route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
