const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const client = require("./database/connection")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
 

const app = express();

const SECRET_KEY = process.env.JWT_SECRET || "sarvam_backned_2336bcghbhbW@"; 


// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request body

// Test API
app.get("/", (req, res) => {
    res.send("Hello, Sarvam Backend!");
});



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

const otpStorage = {};

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] && otpStorage[email] === otp) {
        console.log("✅ OTP Verified Successfully!");
        delete otpStorage[email]; // Remove OTP after successful verification
        return res.json({ message: "OTP verified successfully!" });
    } else {
        console.log("❌ Invalid OTP for:", email);
        return res.status(400).json({ message: "Invalid OTP! Try again." });
    }
});

// Sign-up API Route
app.post("/signup", async (req, res) => {
    try {
      const { username, email, mobileNumber, password } = req.body;
  
      // ✅ Check if the email or mobile number already exists
      const existingUser = await client.query(
        `SELECT * FROM users WHERE email = $1 OR mobile_number = $2`,
        [email, mobileNumber]
      );
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: "❌ Email or mobile number already registered!",
        });
      }
  
      // ✅ Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // ✅ Insert user data into PostgreSQL
      const result = await client.query(
        `INSERT INTO users (username, email, mobile_number, password) 
         VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, mobile_number`,
        [username, email, mobileNumber, hashedPassword]
      );
  
      console.log("✅ User Registered:", result.rows[0]);
  
      res.status(201).json({ message: "Signup successful!", user: result.rows[0] });
    } catch (error) {
      console.error("❌ Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check if user exists in the database
        const userResult = await client.query(
            `SELECT user_id, username, email, password FROM users WHERE email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "❌ Invalid email or password!" });
        }

        const user = userResult.rows[0];

        // ✅ Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "❌ Invalid email or password!" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
          { user_id: user.user_id, email: user.email, username: user.username },
          SECRET_KEY, // ✅ Ensure this is properly defined
          { expiresIn: "7d" } // Token valid for 7 days
      );

        console.log("✅ User Logged In:", user.username);

        // ✅ Return success response with JWT token
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

  
  

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});