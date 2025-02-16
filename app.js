const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Sarvam',
    password: '@Jethvac0629'
});


// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request body

// Test API
app.get("/", (req, res) => {
    res.send("Hello, Sarvam Backend!");
});

// Sign-up API Route
app.post("/signup", (req, res) => {

    const { username, email, mobileNumber, password } = req.body;

    console.log("Received Signup Data:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Mobile Number:", mobileNumber);

    res.json({ message: "Signup successful!", user: { username, email } });
});

  

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});