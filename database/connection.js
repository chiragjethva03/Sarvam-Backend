const { Client } = require('pg'); 

const client = new Client({
  user: 'sarvam_user',       // Your PostgreSQL username
  host: 'localhost',         // Database server host
  database: 'sarvam',        // Your PostgreSQL database name
  password: '@Jethvac0629',  // Your PostgreSQL password
  port: 5432,                // Default PostgreSQL port
});

client.connect()
  .then(() => console.log("🚀 Connected to PostgreSQL successfully!"))
  .catch(err => console.error("❌ Connection Error", err.stack));

module.exports = client;
