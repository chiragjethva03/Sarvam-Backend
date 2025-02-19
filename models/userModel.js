const client = require("../database/connection"); // Import PostgreSQL connection

// Function to create the users table
const createUserTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),  -- NULL for Google users
        profile_picture TEXT DEFAULT NULL,  -- NULL initially, stores Google profile URL if available
        mobile_number VARCHAR(20) UNIQUE DEFAULT NULL,  -- NULL initially for Google users
        gender VARCHAR(20) DEFAULT NULL,  -- NULL initially, user can update later
        booking_id INT DEFAULT NULL,  -- NULL initially, updated when user books
        referral_code VARCHAR(50) DEFAULT NULL,  -- NULL initially, user can add later
        group_id INT DEFAULT NULL,  -- NULL initially, used for user groups
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ✅ Add trigger function to update `updated_at` on row update
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      CREATE TRIGGER trigger_set_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("✅ Users table updated and created successfully!");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
};

// Export the function to be used in setup scripts
module.exports = { createUserTable };

// If running this file directly, execute the function
if (require.main === module) {
  createUserTable().then(() => process.exit()); // Exit after running
}
