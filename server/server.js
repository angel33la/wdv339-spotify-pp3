const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');



dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Music Search App Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});