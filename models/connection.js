const mysql = require("mysql2");

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Sarvam',
    password: '@Jethvac0629'
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database.");

    // Ensure the `users` table exists
    const createUsersTable = `
        CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;

    connection.query(createUsersTable, (err, result) => {
        if (err) {
            console.error("Error creating users table:", err);
        } else {
            console.log("Users table checked/created successfully.");
        }
    });
});

module.exports = connection;
