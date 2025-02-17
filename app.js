const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

const otpStorage = {};

app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStorage[email] = otp; // Store OTP temporarily

    // Send OTP via email (Nodemailer)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sarvam023@gmail.com",
            pass: "rsiu xwed rjcc tkwr"
        }
    });

    const mailOptions = {
        from: "sarvam023@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Failed to send OTP!" });
    }
});

// ✅ **API: Verify OTP**
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required!" });
    }

    if (otpStorage[email] && otpStorage[email] === otp) {
        delete otpStorage[email]; // Remove OTP after successful verification
        res.json({ message: "OTP verified successfully!" });
    } else {
        res.status(400).json({ message: "Invalid OTP! Try again." });
    }
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