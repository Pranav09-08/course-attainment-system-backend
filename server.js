// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parse JSON requests
app.use(cors());            // Enable CORS for cross-origin requests

// Example route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Another example API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, this is a test API!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
